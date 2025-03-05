import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from 'jspdf'
import ShortUniqueId from 'short-unique-id';

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
      const appointment = await axios.post("http://localhost:3000/api/appointments", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Appointment booked successfully!");
      generatePDF(appointment._id);
      setFormData(initialState);

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    const uid = new ShortUniqueId({
      dictionary: [
        '0', '1', '2', '3',
        '4', '5', '6', '7',
        '8', '9'
      ],
    });

    const appointment_id = uid.randomUUID(6);
    const doc = new jsPDF();
    const marginLeft = 10;
    const marginTop = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logo = "../../logo.png";
  
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };
  
    try {
      const logoImg = await loadImage(logo);
      doc.addImage(logoImg, "PNG", marginLeft, marginTop, 30, 30);
    } catch (err) {
      doc.setFontSize(10);
      doc.text("Logo Unavailable", marginLeft, marginTop + 5);
      console.error("Error loading logo:", err);
    }
  
    doc.setFontSize(10);
    const companyInfo = [
      "Email: help@jigisha.org",
      "Address: B-121, Shyam Kunj, Gali No. 10,",
      "Goyla Extension, Najafgarh, New Delhi, India",
    ];
    const companyX = pageWidth - marginLeft - 80;
    let headerY = marginTop + 5;
    companyInfo.forEach((line) => {
      doc.text(line, companyX, headerY, { maxWidth: 80, align: "right" });
      headerY += 5;
    });
  
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop + 35, pageWidth - marginLeft, marginTop + 35);
  
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Receipt", pageWidth / 2, marginTop + 50, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`ID: ${appointment_id}`, pageWidth / 2, marginTop + 58, { align: "center" });
  
    const patientData = [
      ["Name", formData.name || "N/A"],
      ["Age", formData.age || "N/A"],
      ["Gender", formData.gender || "N/A"],
      ["Phone", formData.phone || "N/A"],
      ["Address", formData.address || "N/A"],
      ["Aadhar No.", formData.aadharNo || "N/A"],
    ];
    doc.setFontSize(11);
    let currentY = marginTop + 70;
    patientData.forEach(([label, value], index) => {
      const xPos = marginLeft + (index % 2) * 90;
      const yPos = currentY + Math.floor(index / 2) * 12;
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, xPos, yPos);
      doc.setFont("helvetica", "normal");
      const textLines = doc.splitTextToSize(value, 65);
      doc.text(textLines, xPos + 25, yPos);
      if (textLines.length > 1 && index % 2 === 1) {
        currentY += (textLines.length - 1) * 5;
      }
    });
    currentY += Math.ceil(patientData.length / 2) * 12 + 10;
  
    if (formData.photo) {
      const photoData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(formData.photo);
      });
      const photoX = pageWidth - 50;
      const photoY = marginTop + 65; 
      doc.addImage(photoData, "JPEG", photoX, photoY, 40, 48);
    }
  
    const appointmentData = [
      ["Doctor", doctors.find((d) => d._id === formData.doctorId)?.name || "N/A"],
      ["Time Slot", new Date(formData.appointmentDate).toLocaleString('en-GB', {hour12: true})],
      ["Issue", formData.issue || "Not specified"],
      ["Generated At", new Date().toLocaleString('en-GB', {hour12: true})]
    ];
    doc.setFillColor(240, 240, 240);
    doc.rect(marginLeft, currentY, pageWidth - 20, 50, "F");
    doc.setFontSize(12);
    appointmentData.forEach(([label, value], index) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, marginLeft + 5, currentY + 10 + index * 10);
      doc.setFont("helvetica", "normal");
      doc.text(value, marginLeft + 35, currentY + 10 + index * 10, { maxWidth: 140 });
    });
    currentY += 60;
  
    const footerY = pageHeight - 15;
    doc.setLineWidth(0.3);
    doc.line(marginLeft, footerY - 5, pageWidth - marginLeft, footerY - 5);
    doc.setFontSize(10);
    doc.text("www.jigisha.org", pageWidth / 2, footerY, { align: "center" });
  
    doc.save(`appointment_${appointment_id}.pdf`);
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
              {new Date(slot).toLocaleString('en-GB', {hour12: true})}
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