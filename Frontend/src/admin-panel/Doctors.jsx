import  { useState, useEffect } from "react";
import { fetchDoctors, addDoctor, updateDoctor, deleteDoctor } from "./api/doctors"; 
import { useNavigate } from "react-router-dom";

const DoctorManagementPage = () => {
  const [doctors, setDoctors] = useState([]); 
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    availableSlots: [""],
    district: "" 
  });
  const [isEditing, setIsEditing] = useState(false); 
  const [currentDoctorId, setCurrentDoctorId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const data = await fetchDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        navigate('/admin/login');
      }
    };
    getDoctors();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "availableSlots") {
      const index = e.target.dataset.index;
      const updatedSlots = [...formData.availableSlots];
      updatedSlots[index] = value;
      setFormData((prev) => ({
        ...prev,
        availableSlots: updatedSlots,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const addSlot = () => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: [...prev.availableSlots, ""]
    }));
  };


  const removeSlot = (index) => {
    const updatedSlots = formData.availableSlots.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      availableSlots: updatedSlots,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {

      try {
        const updatedDoctor = await updateDoctor(currentDoctorId, formData);
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor._id === currentDoctorId ? updatedDoctor : doctor
          )
        );
      } catch (error) {
        console.error("Error updating doctor:", error);
      }
    } else {

      try {
        const newDoctor = await addDoctor(formData);
        setDoctors((prev) => [...prev, newDoctor]);
      } catch (error) {
        console.error("Error adding doctor:", error);
      }
    }
    setFormData({ name: "", specialization: "", availableSlots: [""], district: "" });
    setIsEditing(false);
  };


  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors((prev) => prev.filter((doctor) => doctor._id !== id));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };


  const handleEdit = (doctor) => {
    console.log(doctor.availableSlots);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      availableSlots: doctor.availableSlots.map((slot) => new Date(slot).toISOString().slice(0, 16)), 
      district: doctor.district
    });
    setIsEditing(true);
    setCurrentDoctorId(doctor._id);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Doctor Management</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Doctor" : "Add New Doctor"}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium">Available Slots</label>
            {formData.availableSlots.map((slot, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="datetime-local"
                  name="availableSlots"
                  value={slot}
                  onChange={handleChange}
                  data-index={index}
                  className="px-4 py-2 border rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeSlot(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSlot}
              className="text-blue-500 mt-2"
            >
              Add Another Slot
            </button>
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md">
            {isEditing ? "Update Doctor" : "Add Doctor"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Specialization</th>
              <th className="px-4 py-2 text-left border-b">District</th>
              <th className="px-4 py-2 text-left border-b">Available Slots</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="px-4 py-2 border-b">{doctor.name}</td>
                <td className="px-4 py-2 border-b">{doctor.specialization}</td>
                <td className="px-4 py-2 border-b">{doctor.district}</td>
                <td className="px-4 py-2 border-b">
                  {doctor.availableSlots.map((slot, idx) => (
                    <div key={idx}>{new Date(slot).toLocaleString('en-GB', {hour12: true})}</div> 
                  ))}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(doctor)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(doctor._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorManagementPage;