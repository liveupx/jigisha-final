import { useEffect, useState } from "react";
import { fetchAppointments, deleteAppointment } from "./api/appointments";
import { FaTrash, FaFilePdf } from "react-icons/fa"; // Added FaFilePdf for icon
import { useNavigate } from "react-router-dom";
import generatePDF from '../utils/generatePDF'; // Import generatePDF

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(id);
        setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleViewPDF = async (appointment) => {
    try {
      // Map appointment data to formData structure expected by generatePDF
      const formData = {
        name: appointment.name,
        age: appointment.age,
        gender: appointment.gender,
        phone: appointment.phone,
        address: appointment.address,
        aadharNo: appointment.aadharNo,
        doctorId: appointment.doctorId?._id,
        appointmentDate: appointment.appointmentDate,
        issue: appointment.issue,
        photo: appointment.photo, // Already base64 from API
      };

      // Pass all appointments' doctorId references as doctors array
      const doctors = appointments.map(appt => appt.doctorId);
      console.log(doctors, formData, appointment._id);
      await generatePDF(appointment._id, formData, doctors);
      // window.open(pdfUrl, '_blank'); // Open in new tab
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-3">Patient</th>
              <th className="p-3">Age</th>
              <th className="p-3">Gender</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Photo</th>
              <th className="p-3">Aadhar</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border-b">
                <td className="p-3">{appt.name || "N/A"}</td>
                <td className="p-3">{appt.age || "N/A"}</td>
                <td className="p-3">{appt.gender || "N/A"}</td>
                <td className="p-3">{appt.phone || "N/A"}</td>
                <td className="p-3">{appt.doctorId?.name || "N/A"}</td>
                <td className="p-3">{new Date(appt.appointmentDate).toLocaleString() || "N/A"}</td>
                <td className="p-3">
                  {appt.photo && <img src={appt.photo} alt="Patient" className="h-12 w-12 rounded" />}
                </td>
                <td className="p-3">
                  {appt.aadharPhoto && <img src={appt.aadharPhoto} alt="Aadhar" className="h-12 w-12 rounded" />}
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => handleViewPDF(appt)}
                    className="text-blue-500 hover:text-blue-700"
                    title="View PDF"
                  >
                    <FaFilePdf />
                  </button>
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;