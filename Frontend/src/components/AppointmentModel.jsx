import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import generatePDF from "../utils/generatePDF";

const AppointmentPage = () => {
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
    aadharNo: "",
    issue: "",
    photo: null,
    aadharPhoto: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/doctors")
      .then((res) => {
        setDoctors(res.data);
        const uniqueDistricts = [...new Set(res.data.map(doc => doc.district))]; // Extract unique districts
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
      setFormData({ ...formData, district: value, doctorId: "", appointmentDate: "" }); // Reset doctor & slots on district change
      setAvailableSlots([]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const appointment = await axios.post("http://localhost:3000/api/appointments", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  return (
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

        <label className="block text-gray-700">Aadhar No.</label>
        <input type="text" name="aadharNo" className="w-full p-2 border rounded" placeholder="Enter Aadhar number" onChange={handleChange} />

        <label className="block text-gray-700">Upload Photo</label>
        <input type="file" name="photo" className="w-full p-2 border rounded" accept="image/*" onChange={handleFileChange} />

        <label className="block text-gray-700">Upload Aadhar</label>
        <input type="file" name="aadharPhoto" className="w-full p-2 border rounded" accept="image/*" onChange={handleFileChange} />

        <label className="block text-gray-700">Issue (Optional)</label>
        <textarea name="issue" className="w-full p-2 border rounded" placeholder="Describe your issue" onChange={handleChange}></textarea>

        <button onClick={handleSubmit} className="bg-[#311840] text-white w-full p-2 rounded" disabled={loading}>
          {loading ? "Booking..." : "Confirm"}
        </button>

        <button onClick={() => navigate("/")} className="mt-4 text-[#311840] underline">Cancel</button>
      </div>
    </div>
  );
};

export default AppointmentPage;