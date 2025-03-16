import { useEffect, useState } from "react";
import { deleteAppointment, fetchTodaysAppointments, fetchUpcomingAppointments, fetchPastAppointments } from "./api/appointments";
import { FaTrash, FaFilePdf, FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import generatePDF from '../utils/generatePDF'; 

const Appointments = () => {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      const todayData = await fetchTodaysAppointments();
      setTodaysAppointments(todayData);

      const upcomingData = await fetchUpcomingAppointments();
      setUpcomingAppointments(upcomingData);

      const pastData = await fetchPastAppointments();
      setPastAppointments(pastData);
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
        setTodaysAppointments((prev) => prev.filter((appt) => appt._id !== id));
        setUpcomingAppointments((prev) => prev.filter((appt) => appt._id !== id));
        setPastAppointments((prev) => prev.filter((appt) => appt._id !== id));
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const handleViewPDF = async (appointment) => {
    try {
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

      const doctors = [...todaysAppointments, ...upcomingAppointments, ...pastAppointments].map(appt => appt.doctorId);
      await generatePDF(appointment._id, formData, doctors);

    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const renderAppointmentList = (appointments) => (
    appointments.length === 0 ? (
      <p className="text-gray-500 text-center">No appointments found.</p>
    ) : (
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="p-3">Patient</th>
            <th className="p-3">ID</th>
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
    )
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <>
          {/* Today's Appointments */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Today's Appointments</h3>
            {renderAppointmentList(todaysAppointments)}
          </div>

          {/* Upcoming Appointments (Collapsible) */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer bg-gray-200 p-3 rounded-md"
              onClick={() => setShowUpcoming(!showUpcoming)}
            >
              <h3 className="text-xl font-semibold">Upcoming Appointments</h3>
              {showUpcoming ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showUpcoming && <div className="mt-2">{renderAppointmentList(upcomingAppointments)}</div>}
          </div>

          {/* Past Appointments (Collapsible) */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer bg-gray-200 p-3 rounded-md"
              onClick={() => setShowPast(!showPast)}
            >
              <h3 className="text-xl font-semibold">Past Appointments</h3>
              {showPast ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {showPast && <div className="mt-2">{renderAppointmentList(pastAppointments)}</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default Appointments;