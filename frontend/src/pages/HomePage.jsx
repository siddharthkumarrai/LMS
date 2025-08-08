import { motion } from 'framer-motion'; // Missing import added
import PWSkillsHeroSection from '../components/ui/AnimatedHeroSection';
import InfiniteScroller from '../components/ui/InfiniteScroller';
import StatsAndLogos from '../components/ui/StatsAndLogos';
import MentorLedCoursesSection from '../components/ui/MentorLedCoursesSection';
import StudentTestimonialsSection from '../components/ui/StudentTestimonialsSection';
import InteractiveLearningSection from '../components/ui/InteractiveLearningSection';
import MeetOurMentorsSection from '../components/ui/MeetOurMentorsSection';
import MasterclassSection from '../components/ui/MasterclassSection';
import FreeCoursesSection from '../components/ui/FreeCoursesSection';
import BecomeInstructor from '../components/ui/BecomeInstructor';
import CreateCourse from './CreateCourse';

const sampleData = [
  {
    id: 1,
    name: "Vipin Vishal",
    jobTitle: "First Job",
    courseDescription: "Full Stack Development with AI",
    categoryTag: "Software Development Courses",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    companyName: "wipro"
  },
  {
    id: 2,
    name: "Raghav Bakshi",
    jobTitle: "First Job",
    courseDescription: "Data Science With Generative AI",
    categoryTag: "Data Science & Analytics",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    companyName: "SWIGGY"
  },
  {
    id: 3,
    name: "Devanshu Jain",
    jobTitle: "First Job",
    courseDescription: "Data Science With Generative AI",
    categoryTag: "Data Science & Analytics",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    companyName: "TCS"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    jobTitle: "Career Switch",
    courseDescription: "Digital Marketing With AI Specialist",
    categoryTag: "Digital Marketing With AI",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    companyName: "Google"
  }
];

const HomePage = () => {
  return (
    <main className="relative min-h-screen"> {/* Added relative positioning */}

      {/* Hero Section */}
      <section id="hero" className="relative w-full min-h-screen">
        <PWSkillsHeroSection />
      </section>

      {/* Spacer */}
      <div className="h-16 md:h-24 " />

      {/* Success Stories Section */}
      <section id="success-stories" className="relative w-full">
        <div className="relative container mx-auto px-4 lg:px-8"> {/* Added relative positioning */}

          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Student Success Stories
              </h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                Real stories from students who transformed their careers with our industry-leading courses
              </p>

              {/* Decorative line */}
              <div className="flex items-center justify-center mt-8">
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
                <div className="w-2 h-2 bg-blue-500 rounded-full mx-3" />
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full" />
              </div>
            </motion.div>
          </div>

        </div>

        {/* Infinite Scroller */}
        <div className="relative"> {/* Added container with relative positioning */}
          <InfiniteScroller
            items={sampleData}
            speed="normal"
            direction="left"
            pauseOnHover={true}
          />
        </div>
      </section>

      {/* Spacer */}
      <div className="h-16 md:h-24 bg-gradient-to-b from-gray-900 to-black" />

      {/* Stats and Company Logos Section */}
      <section id="stats-logos" className="relative w-full">
        <StatsAndLogos />
      </section>

      {/* Spacer */}
      <div className="h-16 md:h-24 bg-gradient-to-b from-black to-gray-900" />

      <section id="stats-logos" className="relative w-full">
        <MentorLedCoursesSection />
      </section>

      <section id="stats-logos" className="relative w-full">
        <StudentTestimonialsSection />
      </section>

    <section id="stats-logos" className="relative w-full">
      <InteractiveLearningSection />
    </section>

     <section id="stats-logos" className="relative w-full">
      <MeetOurMentorsSection />
     </section>

     <section id="stats-logos" className="relative w-full">
      <MasterclassSection />
     </section>
     
     <section id="stats-logos" className="relative w-full">
      <FreeCoursesSection />
     </section>

     <section id="stats-logos" className="relative w-full">
      <BecomeInstructor />
     </section>

    </main>
  );
};

export default HomePage;
