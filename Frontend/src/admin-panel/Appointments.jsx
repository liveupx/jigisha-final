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
        doctorId: appointment.doctorId?._id,
        district: appointment.doctorId?.district,
        appointmentDate: appointment.appointmentDate,
        issue: appointment.issue,
        idType: appointment.idType,
        idNumber: appointment.idNumber,
      };

      const doctors = appointments.map(appt => appt.doctorId);
      await generatePDF(appointment._id, formData, doctors);

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
              <th className="p-3">Id</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">District</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id} className="border-b">
                <td className="p-3">{appt.name + "/" + appt.age + "/" + (appt.gender === "Male" ? "M" : appt.gender === "Female" ? "F" : "O") || "N/A"}</td>
                <td className="p-3">{(appt.idType && appt.idNumber ? appt.idType +"-"+ appt.idNumber : "")|| "N/A"}</td>
                <td className="p-3">{appt.phone || "N/A"}</td>
                <td className="p-3">{appt.doctorId?.name || "N/A"}</td>
                <td className="p-3">{appt.doctorId?.district || "N/A"}</td>
                <td className="p-3">{new Date(appt.appointmentDate).toLocaleString() || "N/A"}</td>
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