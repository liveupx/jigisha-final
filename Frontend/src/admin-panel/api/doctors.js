import axios from "axios";

const API_URL = 'http://localhost:3000/api/doctors';

// Get all doctors
export const fetchDoctors = async () => {
  try {
    const response = await axios.get(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
};

// Add a new doctor
export const addDoctor = async (doctorData) => {
  try {
    const response = await axios.post(API_URL, doctorData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw error;
  }
};

// Update doctor details
export const updateDoctor = async (id, doctorData) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, doctorData, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw error;
  }
};

// Delete a doctor
export const deleteDoctor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Error deleting doctor:", error);
    throw error;
  }
};