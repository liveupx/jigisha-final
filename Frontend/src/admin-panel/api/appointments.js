import axios from "axios";

const API_URL = "http://localhost:3000/api/appointments"; 

// Fetch all appointments
export const fetchAppointments = async () => {
  const response = await axios.get(API_URL, { withCredentials: true }); 
  return response.data;
};

export const fetchTodaysAppointments = async () => {
  const response = await axios.get(`${API_URL}/today`, { withCredentials: true });
  return response.data;
}

export const fetchUpcomingAppointments = async () => {
  const response = await axios.get(`${API_URL}/upcoming`, { withCredentials: true });
  return response.data;
}

export const fetchPastAppointments = async () => {
  const response = await axios.get(`${API_URL}/past`, { withCredentials: true });
  return response.data;
}

// Fetch a single appointment by ID
export const getAppointmentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
};

// Delete appointment
export const deleteAppointment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {withCredentials: true});
  return response.data;
};