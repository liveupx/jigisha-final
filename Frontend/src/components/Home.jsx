import Welcome from "./Welcome";
import AboutUs from "./AboutUs";
import Programs from "./Programs";
import Gallery from "./Gallery";
import AppointmentModal from "./AppointmentModel";
import { useState } from "react";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Welcome />
      <AboutUs />
      <Programs />
      <Gallery />

      <button
        className="fixed bottom-6 right-6 bg-[#311840] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#4a2060] transition"
        onClick={() => setIsModalOpen(true)}
      >
        Book an Appointment
      </button>

      {isModalOpen && <AppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Home;