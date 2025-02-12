import { useState } from "react";
import AppointmentModal from "./AppointmentModel";

const LandingPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
      <h2 className="text-4xl text-[#311840] font-bold">Welcome to Jigisha</h2>
      <p className="text-gray-700 mt-4">Providing free counseling for those in need</p>
      <button onClick={() => setModalOpen(true)} className="mt-6 bg-[#311840] text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-900">
        Book an Appointment
      </button>
      <AppointmentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default LandingPage