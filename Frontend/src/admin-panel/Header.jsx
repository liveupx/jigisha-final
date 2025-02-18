import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
          await axios.post("http://localhost:3000/admin/logout", {}, { withCredentials: true });
          return navigate("/admin/login");
        } catch (err) {
          console.error(err);
        }
    };

    return (
      <div className="w-full bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded"><a onClick={handleLogout}>Logout</a></button>
      </div>
    );
  };
  
  export default Header;