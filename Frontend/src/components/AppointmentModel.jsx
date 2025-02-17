import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const AppointmentPage = () => {
  const navigate = useNavigate();

  const initialState = {
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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  useEffect(() => {
    const selectedDoctor = doctors.find(doc => doc._id === formData.doctorId);
    setAvailableSlots(selectedDoctor ? selectedDoctor.availableSlots : []);
  }, [formData.doctorId, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      await axios.post("http://localhost:3000/api/appointments", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Appointment booked successfully!");
      generatePDF();
      setFormData(initialState);

      // Navigate back to home or success page after 2 seconds
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Appointment Details", 20, 20);
    doc.setFontSize(12);

    const fields = [
      { label: "Doctor", value: doctors.find((d) => d._id === formData.doctorId)?.name || "" },
      { label: "Time Slot", value: formData.appointmentDate },
      { label: "Name", value: formData.name },
      { label: "Age", value: formData.age },
      { label: "Gender", value: formData.gender },
      { label: "Address", value: formData.address },
      { label: "Phone No.", value: formData.phone },
      { label: "Aadhar No.", value: formData.aadharNo },
      { label: "Issue", value: formData.issue || "Not specified" },
    ];

    let yPosition = 30;
    fields.forEach(({ label, value }) => {
      doc.text(`${label}: ${value}`, 20, yPosition);
      yPosition += 10;
    });

    doc.save("appointment.pdf");
  };

  return (
    <div className="container mx-auto p-6 max-w-lg mt-20 px-4">
      <h2 className="text-xl font-bold text-[#311840] mb-4">Book an Appointment</h2>

      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        <label className="block text-gray-700">Select Doctor</label>
        <select name="doctorId" className="w-full p-2 border rounded" onChange={handleChange} value={formData.doctorId}>
          <option value="">Select a Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>{doctor.name} - {doctor.specialization}</option>
          ))}
        </select>

        <label className="block text-gray-700">Choose Time Slot</label>
        <select name="appointmentDate" className="w-full p-2 border rounded" onChange={handleChange} value={formData.appointmentDate} disabled={!formData.doctorId}>
        <option value="">Select a Time Slot</option>
          {availableSlots.map((slot, index) => (
            <option key={`${slot}-${index}`} value={slot}>
              {new Date(slot).toLocaleString()}
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