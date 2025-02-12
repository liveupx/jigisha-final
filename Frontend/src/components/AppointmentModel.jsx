import { useState } from "react";
import { jsPDF } from "jspdf";

const AppointmentModal = ({ isOpen, onClose }) => {
  const initialState = {
    doctor: "Select a Doctor",
    time: "",
    fullName: "",
    address: "",
    phone: "",
    aadhar: "",
    issue: "",
    aadharFile: null,
    photoFile: null,
    photoPreview: "",
  };
  
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (name === "photoFile") {
          setFormData((prev) => ({ ...prev, photoPreview: reader.result }));
        }
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, [name]: file });
    }
  };

  const generatePDF = (e) => {
    e.preventDefault();

    if (!formData || !formData.fullName || !formData.doctor) {
        alert("Please fill in all required fields.");
        return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Appointment Details", 20, 20);
    doc.setFontSize(12);

    const fields = [
        { label: "Doctor", value: formData.doctor },
        { label: "Time Slot", value: formData.time },
        { label: "Full Name", value: formData.fullName },
        { label: "Address", value: formData.address },
        { label: "Phone No.", value: formData.phone },
        { label: "Aadhar No.", value: formData.aadhar },
        { label: "Issue", value: formData.issue || "Not specified" },
    ];

    let yPosition = 30;
    fields.forEach(({ label, value }) => {
        doc.text(`${label}: ${value}`, 20, yPosition);
        yPosition += 10;
    });

    if (formData.photoPreview) {
        doc.addImage(formData.photoPreview, "JPEG", 20, yPosition, 50, 50);
    }

    doc.save("appointment.pdf");
    setFormData(initialState);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold text-[#311840] mb-4">Book an Appointment</h2>
        <form onSubmit={generatePDF} className="space-y-4">
          <label className="block text-gray-700">Select Doctor</label>
          <select name="doctor" className="w-full p-2 border rounded" onChange={handleChange} value={formData.doctor}>
            <option>Select a Doctor</option>
            <option>Dr. Smith</option>
            <option>Dr. Johnson</option>
            <option>Dr. Williams</option>
          </select>
          
          <label className="block text-gray-700">Choose Time Slot</label>
          <input type="time" name="time" className="w-full p-2 border rounded" onChange={handleChange} />
          
          <label className="block text-gray-700">Full Name</label>
          <input type="text" name="fullName" className="w-full p-2 border rounded" placeholder="Enter full name" onChange={handleChange} />
          
          <label className="block text-gray-700">Address</label>
          <input type="text" name="address" className="w-full p-2 border rounded" placeholder="Enter address" onChange={handleChange} />
          
          <label className="block text-gray-700">Phone No.</label>
          <input type="tel" name="phone" className="w-full p-2 border rounded" placeholder="Enter phone number" onChange={handleChange} />
          
          <label className="block text-gray-700">Aadhar No.</label>
          <input type="text" name="aadhar" className="w-full p-2 border rounded" placeholder="Enter Aadhar number" onChange={handleChange} />
          
          <label className="block text-gray-700">Upload Aadhar</label>
          <input type="file" name="aadharFile" className="w-full p-2 border rounded" onChange={handleFileChange} />
          
          <label className="block text-gray-700">Upload Photo</label>
          <input type="file" name="photoFile" className="w-full p-2 border rounded" accept="image/*" onChange={handleFileChange} />
          
          <label className="block text-gray-700">Issue (Optional)</label>
          <textarea name="issue" className="w-full p-2 border rounded" placeholder="Describe your issue" onChange={handleChange}></textarea>
          
          <button type="submit" className="bg-[#311840] text-white w-full p-2 rounded">Confirm</button>
        </form>
        <button onClick={onClose} className="mt-4 text-[#311840] underline">Cancel</button>
      </div>
    </div>
  );
};

export default AppointmentModal;
