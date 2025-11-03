import { useState } from "react";
import axios from "axios";

export default function VolunteerForm() {
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("anytime");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("You must be logged in!");
        return;
      }
      const { token } = JSON.parse(storedUser);

      // POST to the correct backend route
      await axios.post(
        "http://localhost:5000/api/volunteers/register",
        {
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean), // remove empty skills
          availability,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Volunteer profile created!");
    } catch (error) {
      console.error("Error creating volunteer profile:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating volunteer profile");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 mt-8 border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Volunteer Registration</h2>
      
      <label className="block mb-2 font-medium text-gray-700">Skills (comma separated):</label>
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        required
        placeholder="e.g., Cooking, Teaching, Driving"
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
      />

      <label className="block mb-2 font-medium text-gray-700">Availability:</label>
      <select
        value={availability}
        onChange={(e) => setAvailability(e.target.value)}
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
      >
        <option value="weekdays">Weekdays</option>
        <option value="weekends">Weekends</option>
        <option value="anytime">Anytime</option>
      </select>

      <button 
        type="submit" 
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-200"
      >
        Submit
      </button>
    </form>
  );
}
