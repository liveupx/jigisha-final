import Welcome from "./Welcome";
import AboutUs from "./AboutUs";
import Programs from "./Programs";
import Gallery from "./Gallery";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Welcome />
      <AboutUs />
      <Programs />
      <Gallery />

      <button
        className="fixed bottom-6 right-6 bg-[#311840] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#4a2060] transition"
        onClick={() => navigate("/appointment")}
      >
        Book an Appointment
      </button>
    </div>
  );
};

export default Home;