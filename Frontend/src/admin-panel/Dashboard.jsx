import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, appointmentRes] = await Promise.all([
          axios.get("http://localhost:3000/api/doctors"),
          axios.get("http://localhost:3000/api/appointments"),
        ]);
        setDoctors(doctorRes.data);
        setAppointments(appointmentRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const pastAppointments = appointments.filter(appt => new Date(appt.appointmentDate) < today);
  const upcomingAppointments = appointments.filter(appt => new Date(appt.appointmentDate) >= tomorrow);
  const todayAppointments = appointments.filter(appt => {
    const date = new Date(appt.appointmentDate);
    return date >= today && date < tomorrow;
  });

  const doctorAppointmentData = doctors.map((doctor) => ({
    name: doctor.name,
    appointments: appointments.filter((app) => app.doctorId?._id === doctor._id).length,
  }));

  const timeSlotData = appointments.reduce((acc, app) => {
    const slot = new Date(app.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    acc[slot] = (acc[slot] || 0) + 1;
    return acc;
  }, {});

  const timeSlotChartData = Object.keys(timeSlotData).map((key) => ({
    time: key,
    count: timeSlotData[key],
  }));

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Doctors</h3>
              <p className="text-2xl font-bold">{doctors.length}</p>
            </div>

                <Card>
                <CardHeader title="Past Appointments">
                </CardHeader>
                <CardContent>
                <p className="text-2xl font-bold">{pastAppointments.length}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader title="Today's Appointments">
                </CardHeader>
                <CardContent>
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader title="Upcoming Appointments">
                </CardHeader>
                <CardContent>
                <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                </CardContent>
            </Card>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Doctors vs Appointments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={doctorAppointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Time Slot vs Appointments</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSlotChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
