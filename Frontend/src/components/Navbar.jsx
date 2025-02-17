import { Link } from "react-router-dom";

const Navbar = () => {
    return (
      <nav className="bg-[#311840] text-white p-4 fixed w-full top-0 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Jigisha</h1>
          <ul className="flex space-x-6">
            <li className="hover:underline cursor-pointer"><Link to = "/">Home</Link></li>
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Gallery</li>
            <li className="hover:underline cursor-pointer">Services</li>
            <li className="hover:underline cursor-pointer">Contact Us</li>
            <li className="hover:underline cursor-pointer bg-white text-[#503C5C] px-3 py-1 rounded-md">Donate</li>
          </ul>
        </div>
      </nav>
    );
  };

export default Navbar