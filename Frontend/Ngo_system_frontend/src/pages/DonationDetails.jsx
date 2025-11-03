import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineGift } from 'react-icons/ai';

export default function DonationDetails() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("You must be logged in to view donation details.");
      return;
    }
    const { token } = JSON.parse(storedUser);

    axios
      .get(`http://localhost:5000/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setDonation(res.data))
      .catch((err) => setError(err?.response?.data?.message || "Error fetching donation details"));
  }, [id]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!donation) return <div className="p-4">Loading...</div>;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'assigned':
        return <span className="text-white bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1"><AiOutlineClockCircle /> Assigned</span>;
      case 'completed':
        return <span className="text-white bg-green-500 px-3 py-1 rounded-full flex items-center gap-1"><AiOutlineCheckCircle /> Completed</span>;
      case 'pending':
        return <span className="text-white bg-yellow-500 px-3 py-1 rounded-full flex items-center gap-1"><AiOutlineGift /> Pending</span>;
      default:
        return <span className="text-gray-600">{status}</span>;
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto bg-gradient-to-r from-purple-50 to-pink-50 shadow-2xl rounded-2xl p-6 mt-6 border border-purple-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-extrabold mb-4 text-purple-700 flex items-center gap-2">
        <AiOutlineGift size={24} /> Donation Details
      </h2>

      <div className="mb-2 text-gray-800 flex justify-between items-center"><b>Type:</b> {donation.type} {getStatusBadge(donation.status)}</div>
      <div className="mb-2 text-gray-800"><b>Quantity:</b> {donation.quantity}</div>
      <div className="mb-2 text-gray-800"><b>Donor:</b> {donation.donorId?.name} ({donation.donorId?.email})</div>
      {donation.assignedTo && <div className="mb-2 text-gray-800"><b>Assigned Volunteer:</b> {donation.assignedTo?.name} ({donation.assignedTo?.email})</div>}
      {donation.usedFor && <div className="mb-2 text-gray-800"><b>Used For:</b> {donation.usedFor}</div>}
      <div className="mb-2 text-gray-800"><b>Created At:</b> {new Date(donation.createdAt).toLocaleString()}</div>
    </motion.div>
  );
}
