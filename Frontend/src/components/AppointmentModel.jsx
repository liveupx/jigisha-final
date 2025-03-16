import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import generatePDF from "../utils/generatePDF";
import { appointmentFormWarningEnglish, appointmentFormWarningHindi } from "../utils/constants";
import LivingStatusModal from "./LivingStatusModal";

const AppointmentPage = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const initialState = {
    district: "",
    doctorId: "",
    appointmentDate: "",
    name: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    idType: "",
    idNumber: "",
    issue: "",
    livingStatus: "",
  };
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    axios.get("http://localhost:3000/api/doctors")
      .then((res) => {
        const doctorsWithSlots = res.data.filter(doc => doc.availableSlots.length > 0);
        setDoctors(doctorsWithSlots);
        
        const uniqueDistricts = [...new Set(doctorsWithSlots.map(doc => doc.district))];
        setDistricts(uniqueDistricts);
      })
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);
 
  useEffect(() => {
    if (formData.district) {
      setFilteredDoctors(doctors.filter(doc => doc.district === formData.district));
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.district, doctors]);

  useEffect(() => {
    const selectedDoctor = filteredDoctors.find(doc => doc._id === formData.doctorId);
    setAvailableSlots(selectedDoctor ? selectedDoctor.availableSlots : []);
  }, [formData.doctorId, filteredDoctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "district") {
      setFormData({ ...formData, district: value, doctorId: "", appointmentDate: "" }); 
      setAvailableSlots([]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = () => {
    setShowWarning(true); 
  };

  const confirmAppointment = async () => {
    setShowWarning(false);
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const appointment = await axios.post("http://localhost:3000/api/appointments", formDataToSend, {
        headers: { "Content-Type": "application/json" }});

      setSuccessMessage("Appointment booked successfully!");
      await generatePDF(appointment.data.appointment._id, formData, doctors);
      setFormData(initialState);

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleLivingStatusConfirm = (selectedStatus) => {
    setFormData({ ...formData, livingStatus: selectedStatus }); 
    setShowModal(false); 
  };
  

  return (
    <>
    {showModal && <LivingStatusModal onConfirm={handleLivingStatusConfirm} />}

    {/* Warning Modal */}
    {showWarning && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center border-2 border-red-600">
          <h2 className="text-red-600 font-bold text-xl">⚠️ Disclaimer ⚠️</h2>
          <p className="text-gray-800 mt-2">
            {appointmentFormWarningHindi}
          </p>
          <p className="text-gray-800 mt-2">
            {appointmentFormWarningEnglish}
          </p>

          <div className="mt-4 flex justify-center space-x-4">
            <button 
              onClick={confirmAppointment} 
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Agree
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Disagree
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="container mx-auto p-6 max-w-lg mt-20 px-4">
      <h2 className="text-xl font-bold text-[#311840] mb-4">Book an Appointment</h2>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {/* Select District */}
        <label className="block text-gray-700">Select District</label>
        <select name="district" className="w-full p-2 border rounded" onChange={handleChange} value={formData.district}>
          <option value="">Select a District</option>
          {districts.map((district, index) => (
            <option key={index} value={district}>{district}</option>
          ))}
        </select>

        {/* Select Doctor */}
        <label className="block text-gray-700">Select Doctor</label>
        <select name="doctorId" className="w-full p-2 border rounded" onChange={handleChange} value={formData.doctorId} disabled={!formData.district}>
          <option value="">Select a Doctor</option>
          {filteredDoctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
          ))}
        </select>

        {/* Select Time Slot */}
        <label className="block text-gray-700">Choose Time Slot</label>
        <select name="appointmentDate" className="w-full p-2 border rounded" onChange={handleChange} value={formData.appointmentDate} disabled={!formData.doctorId}>
          <option value="">Select a Time Slot</option>
          {availableSlots.map((slot, index) => (
            <option key={`${slot}-${index}`} value={slot}>
              {new Date(slot).toLocaleString('en-GB', { hour12: true })}
            </option>
          ))}
        </select>

        <label className="block text-gray-700">Name</label>
        <input type="text" name="name" className="w-full p-2 border rounded" placeholder="Enter name" onChange={handleChange} />

        <label className="block text-gray-700">Age</label>
        <input type="number" name="age" className="w-full p-2 border rounded" placeholder="Enter age" onChange={handleChange} />

        <label className="block text-gray-700">Gender</label>
        <select name="gender" className="w-full p-2 border rounded" onChange={handleChange} value={formData.gender}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label className="block text-gray-700">Address</label>
        <input type="text" name="address" className="w-full p-2 border rounded" placeholder="Enter address" onChange={handleChange} />

        <label className="block text-gray-700">Phone No.</label>
        <input type="tel" name="phone" className="w-full p-2 border rounded" placeholder="Enter phone number" onChange={handleChange} />

        <label className="block text-gray-700">Select ID Type</label>
        <select
          name="idType"
          className="w-full p-2 border rounded"
          onChange={handleChange}
          value={formData.idType}
          required
        >
          <option value="">Select ID Type</option>
          <option value="Aadhar">Aadhar</option>
          <option value="PAN">PAN</option>
          <option value="DL">Driving License</option>
          <option value="VoterID">Voter ID</option>
        </select>

        <label className="block text-gray-700 mt-2">Enter ID Number</label>
        <input
          type="text"
          name="idNumber"
          className="w-full p-2 border rounded"
          placeholder="Enter selected ID number"
          onChange={handleChange}
          value={formData.idNumber}
          required
        />

        <label className="block text-gray-700">Issue (Optional)</label>
        <textarea name="issue" className="w-full p-2 border rounded" placeholder="Describe your issue" onChange={handleChange}></textarea>

        <button onClick={handleSubmit} className="bg-[#311840] text-white w-full p-2 rounded" disabled={loading}>
            {loading ? "Booking..." : "Confirm"}
        </button>
        
        <button onClick={() => navigate("/")} className="mt-4 text-[#311840] underline">Cancel</button>
      </div>
    </div>
    </>
  );
};

export default AppointmentPage;