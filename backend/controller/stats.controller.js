// controllers/stats.controller.js - Real data only version
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Payment from "../models/payment.model.js";
import AppError from "../utils/error.util.js";

const getAdminStats = async (req, res) => {
    try {
        console.log("🚀 Fetching admin stats (real data only)...");

        // Get current date for time-based calculations
        const currentDate = new Date();
        const twelveMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 12, 1);

        // Aggregate total users and admins
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: { $toLower: "$role" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalUsers = userStats.find(stat =>
            stat._id === "user" || stat._id === "student"
        )?.count || 0;

        const totalAdmins = userStats.find(stat =>
            stat._id === "admin" || stat._id === "instructor"
        )?.count || 0;

        // Total courses count
        const totalCourses = await Course.countDocuments();

        // Check payment data
        const paymentCount = await Payment.countDocuments();
        console.log("💳 Total payments in database:", paymentCount);

        // Initialize with empty arrays - NO FAKE DATA
        let totalRevenue = 0;
        let totalEnrollments = 0;
        let monthlySales = [];
        let coursePopularity = [];
        let recentActivity = [];
        let categoryDistribution = [];

        // ONLY process if real payment data exists
        if (paymentCount > 0) {
            console.log("✅ Processing real payment data...");

            // Payment statistics
            const paymentStats = await Payment.aggregate([
                {
                    $match: {
                        status: { $in: ["success", "SUCCESS"] }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$amount" },
                        totalEnrollments: { $sum: 1 }
                    }
                }
            ]);

            totalRevenue = paymentStats[0]?.totalRevenue || 0;
            totalEnrollments = paymentStats[0]?.totalEnrollments || 0;

            // Monthly sales data - ONLY if data exists
            const monthlySalesData = await Payment.aggregate([
                {
                    $match: {
                        status: { $in: ["success", "SUCCESS"] },
                        createdAt: { $gte: twelveMonthsAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        revenue: { $sum: "$amount" },
                        enrollments: { $sum: 1 }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-",
                                {
                                    $cond: {
                                        if: { $lt: ["$_id.month", 10] },
                                        then: { $concat: ["0", { $toString: "$_id.month" }] },
                                        else: { $toString: "$_id.month" }
                                    }
                                }
                            ]
                        },
                        revenue: 1,
                        enrollments: 1
                    }
                }
            ]);

            monthlySales = monthlySalesData;

            // Course popularity - ONLY real data
            const coursePopularityData = await Payment.aggregate([
                {
                    $match: {
                        status: { $in: ["success", "SUCCESS"] }
                    }
                },
                {
                    $group: {
                        _id: "$courseId",
                        enrollments: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "_id",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                {
                    $unwind: "$courseDetails"
                },
                {
                    $project: {
                        _id: 0,
                        courseId: "$_id",
                        courseName: "$courseDetails.title",
                        category: "$courseDetails.category",
                        enrollments: 1
                    }
                },
                {
                    $sort: { enrollments: -1 }
                },
                {
                    $limit: 10
                }
            ]);

            coursePopularity = coursePopularityData;

            // Recent activity - ONLY real data
            const recentActivityData = await Payment.aggregate([
                {
                    $match: {
                        status: { $in: ["success", "SUCCESS"] }
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $limit: 10
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$userDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$courseDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        studentName: { $ifNull: ["$userDetails.name", "Unknown Student"] },
                        courseTitle: { $ifNull: ["$courseDetails.title", "Unknown Course"] },
                        amount: 1,
                        // FIXED: Direct date formatting from payment createdAt
                        enrollmentDate: {
                            $dateToString: {
                                format: "%Y-%m-%d", // YYYY-MM-DD format
                                date: "$createdAt"
                            }
                        },
                        // Also keep original date for frontend formatting
                        originalDate: "$createdAt"
                    }
                }
            ]);

            recentActivity = recentActivityData;

            // Category distribution - ONLY real data
            const categoryDistributionData = await Payment.aggregate([
                {
                    $match: {
                        status: { $in: ["success", "SUCCESS"] }
                    }
                },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "courseDetails"
                    }
                },
                {
                    $unwind: "$courseDetails"
                },
                {
                    $group: {
                        _id: { $ifNull: ["$courseDetails.category", "Uncategorized"] },
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        count: 1
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            categoryDistribution = categoryDistributionData;

        } else {
            console.log("ℹ️ No payment data found - returning empty arrays");
        }

        const statsData = {
            overview: {
                totalUsers,
                totalAdmins,
                totalCourses,
                totalRevenue,
                totalEnrollments
            },
            monthlySales, // Will be empty array if no data
            coursePopularity, // Will be empty array if no data
            recentActivity, // Will be empty array if no data
            categoryDistribution, // Will be empty array if no data
            metadata: {
                hasPaymentData: paymentCount > 0,
                paymentCount,
                dataSource: paymentCount > 0 ? 'real' : 'empty'
            }
        };

        console.log("✅ Real stats only:", {
            totalUsers,
            totalAdmins,
            totalCourses,
            totalRevenue,
            totalEnrollments,
            hasRealData: paymentCount > 0
        });

        res.status(200).json({
            success: true,
            data: statsData,
            message: "Admin statistics fetched successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics",
            error: error.message
        });
    }
};

const getUserStats = async (req, res) => {
    try {
        console.log("👤 Fetching user stats...");

        const userId = req.user.id; // Get current user ID from auth middleware

        // Get user details with populated subscriptions
        const userDetails = await User.findById(userId).populate('subscriptions');

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get user's enrolled courses (from payments)
        const userEnrollments = await Payment.find({
            userId: userId,
            status: { $in: ["success", "SUCCESS"] }
        }).populate('courseId');

        // Extract course IDs from successful payments
        const enrolledCourseIds = userEnrollments.map(payment => payment.courseId);

        // Get detailed course information
        const enrolledIds = enrolledCourseIds
            ?.filter(course => course && course._id) // null/undefined skip karega
            .map(course => String(course._id)) || [];

        const enrolledCourses = await Course.find({
            _id: { $in: enrolledIds }
        });

        // Calculate category distribution for user's enrolled courses
        const categoryDistribution = {};
        enrolledCourses.forEach(course => {
            const category = course.category || 'Uncategorized';
            categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
        });

        const categoryData = Object.entries(categoryDistribution).map(([category, count]) => ({
            name: category,
            value: count
        }));

        // Calculate user spending
        const totalSpent = userEnrollments.reduce((sum, payment) => sum + payment.amount, 0);

        // Recent enrollments for this user
        const recentEnrollments = await Payment.find({
            userId: userId,
            status: { $in: ["success", "SUCCESS"] }
        })
            .populate('courseId', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        const userStatsData = {
            profile: {
                name: userDetails.name,
                email: userDetails.email,
                joinDate: userDetails.createdAt
            },
            overview: {
                coursesEnrolled: enrolledCourses.length,
                coursesCompleted: 0, // Placeholder for future implementation
                certificatesEarned: 0, // Placeholder for future implementation
                totalSpent: totalSpent,
                hoursLearned: 0 // Placeholder for future implementation
            },
            enrolledCourses: enrolledCourses.map(course => ({
                _id: course._id,
                title: course.title,
                category: course.category,
                thumbnail: course.thumbnail,
                createdBy: course.createdBy,
                progress: 0 // Placeholder for future progress tracking
            })),
            categoryDistribution: categoryData,
            recentActivity: recentEnrollments.map(enrollment => ({
                courseTitle: enrollment.courseId?.title || 'Unknown Course',
                amount: enrollment.amount,
                enrollmentDate: enrollment.createdAt
            }))
        };

        console.log("✅ User stats fetched:", {
            userId,
            coursesEnrolled: enrolledCourses.length,
            totalSpent,
            categoriesCount: categoryData.length
        });

        res.status(200).json({
            success: true,
            data: userStatsData,
            message: "User statistics fetched successfully"
        });

    } catch (error) {
        console.error("❌ Error fetching user stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user statistics",
            error: error.message
        });
    }
};

export { getAdminStats, getUserStats };