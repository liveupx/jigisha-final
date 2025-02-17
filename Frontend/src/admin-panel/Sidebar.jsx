import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link to="/admin/appointments" className="hover:text-gray-300">Appointments</Link>
        <Link to="/admin/doctors" className="hover:text-gray-300">Doctors</Link>
        <Link to="/admin/gallery" className="hover:text-gray-300">Gallery</Link>
        <Link to="/admin/services" className="hover:text-gray-300">Services</Link>
        <Link to="/admin/about-us" className="hover:text-gray-300">About Us</Link>
      </nav>
    </div>
  );
};

export default Sidebar;