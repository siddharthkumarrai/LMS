import { NavbarComponent } from "../components/NavbarComponent";
import { Outlet } from 'react-router'; // children ki jagah Outlet import karein
import WavyFooter from "../components/WavyFooter";
// import Footer from './Footer';

const HomeLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavbarComponent />
            <main className="pt-16">
                <Outlet />
            </main>
            <WavyFooter />
        </div>
    );
};

export default HomeLayout;