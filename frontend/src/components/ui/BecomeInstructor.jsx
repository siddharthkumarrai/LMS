import { Link } from 'react-router';

const BecomeInstructor = () => {
    return (
        <section className="py-16 bg-gray-800 text-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Want to Become an Instructor?
                </h2>
                <p className="max-w-2xl mx-auto text-gray-300 mb-8">
                    Join our team of expert mentors and share your knowledge with thousands of students across the globe.
                </p>
                <Link to="/signup/instructor">
                    <button className="btn btn-primary btn-lg cursor-pointer">
                        Start Teaching Today Click Here
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default BecomeInstructor;