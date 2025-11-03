import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import DonationForm from "./DonationForm";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineGift,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineEye,
  AiOutlineCalendar,
} from "react-icons/ai";

function DonorPage() {
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setIsLoading(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setIsLoading(false);
      return;
    }

    const { token } = JSON.parse(storedUser);

    try {
      const res = await axios.get("http://localhost:5000/api/donations/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);
    } catch (err) {
      console.error(err);
      showPopup("Failed to load donations");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDonation = async (id) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { token } = JSON.parse(storedUser);

      await axios.delete(`http://localhost:5000/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonations((prev) => prev.filter((d) => d._id !== id));
      showPopup("Donation deleted successfully!");
    } catch (err) {
      showPopup(
        "Error deleting donation: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(""), 3000);
  };

  const handleDonationSubmit = (newDonation) => {
    setDonations((prev) => [newDonation, ...prev]);
    setShowForm(false);
    showPopup("Donation submitted successfully!");
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium";
    
    switch (status) {
      case "assigned":
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`}>
            <AiOutlineClockCircle className="text-blue-600" /> Assigned
          </span>
        );
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-50 text-green-700 border border-green-200`}>
            <AiOutlineCheckCircle className="text-green-600" /> Completed
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-amber-50 text-amber-700 border border-amber-200`}>
            <AiOutlineGift className="text-amber-600" /> Pending
          </span>
        );
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-700`}>{status}</span>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned": return "from-blue-500 to-blue-600";
      case "completed": return "from-green-500 to-green-600";
      case "pending": return "from-amber-500 to-amber-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const filteredDonations = donations.filter(donation => {
    if (activeFilter === "all") return true;
    return donation.status === activeFilter;
  });

  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === "pending").length,
    assigned: donations.filter(d => d.status === "assigned").length,
    completed: donations.filter(d => d.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-cyan-50/10 py-8">
      {/* Enhanced Popup Notification */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 bg-white text-gray-800 px-6 py-4 rounded-2xl shadow-xl border border-blue-200 z-50 max-w-sm backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                popupMessage.includes("successfully") 
                  ? "bg-green-100 text-green-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                {popupMessage.includes("successfully") ? "✓" : "!"}
              </div>
              <span className="text-sm font-medium">
                {popupMessage}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Main heading with enhanced gradient */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6"
            >
              Your
              <span className="relative inline-block mx-3">
                <span className="relative z-10 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Contributions
                </span>
                <div className="absolute bottom-2 left-0 w-full h-3 bg-cyan-100/80 -z-0 rounded-lg blur-sm"></div>
              </span>
            </motion.h1>

            {/* Enhanced subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Track and manage your generous contributions that make a real difference
            </motion.p>

            {/* Enhanced separator */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ delay: 0.5 }}
              className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full mb-8 shadow-sm"
            ></motion.div>

            {/* Enhanced stats cards */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              {[
                { label: "Total", value: stats.total, color: "from-slate-600 to-slate-700" },
                { label: "Pending", value: stats.pending, color: "from-amber-500 to-amber-600" },
                { label: "Assigned", value: stats.assigned, color: "from-blue-500 to-blue-600" },
                { label: "Completed", value: stats.completed, color: "from-green-500 to-green-600" },
              ].map((stat, index) => (
                <div key={stat.label} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-200">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Action Section */}
        <div className="text-center mb-12">
          {showForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto"
            >
              <DonationForm onDonationSubmit={handleDonationSubmit} />
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowForm(true)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg flex items-center gap-3 mx-auto group"
            >
              <AiOutlinePlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Create New Donation
            </motion.button>
          )}
        </div>

        {/* Enhanced Filter Section */}
        {donations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-3 justify-center mb-8"
          >
            {[
              { key: "all", label: "All Donations", count: stats.total },
              { key: "pending", label: "Pending", count: stats.pending },
              { key: "assigned", label: "Assigned", count: stats.assigned },
              { key: "completed", label: "Completed", count: stats.completed },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeFilter === filter.key
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                    : "bg-white/80 text-slate-600 hover:bg-white hover:shadow-md border border-slate-200"
                }`}
              >
                <span>{filter.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeFilter === filter.key 
                    ? "bg-white/20 text-white" 
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Enhanced Donation List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-slate-900 flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                <AiOutlineGift className="text-white" size={24} />
              </div>
              Donation History
              {filteredDonations.length > 0 && (
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredDonations.length} items
                </span>
              )}
            </motion.h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
                  <div className="h-10 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredDonations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AiOutlineGift size={40} className="text-cyan-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                {activeFilter === "all" ? "No donations yet" : `No ${activeFilter} donations`}
              </h3>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                {activeFilter === "all" 
                  ? "Start making a difference by creating your first donation." 
                  : `You don't have any ${activeFilter} donations at the moment.`
                }
              </p>
              {activeFilter === "all" && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold"
                >
                  Create First Donation
                </button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map((donation, idx) => (
                <motion.div
                  key={donation._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden hover:translate-y-[-4px]"
                >
                  {/* Status Header */}
                  <div className={`h-2 bg-gradient-to-r ${getStatusColor(donation.status)}`}></div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg capitalize mb-2">
                          {donation.type}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <AiOutlineCalendar className="text-slate-400" />
                          <span>Created {new Date(donation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {getStatusBadge(donation.status)}
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-xl">
                        <span className="text-slate-600 font-medium">Quantity</span>
                        <span className="text-slate-900 font-bold text-lg">{donation.quantity}</span>
                      </div>
                      {donation.description && (
                        <div className="py-3 px-4 bg-slate-50 rounded-xl">
                          <span className="text-slate-600 font-medium block mb-2">Description</span>
                          <p className="text-slate-900 text-sm leading-relaxed">{donation.description}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/donation/${donation._id}`}
                        className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-center text-sm flex items-center justify-center gap-2 group-hover:from-slate-800 group-hover:to-slate-900"
                      >
                        <AiOutlineEye size={16} />
                        View Details
                      </Link>
                      
                      {donation.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => deleteDonation(donation._id)}
                          className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200"
                          title="Delete Donation"
                        >
                          <AiOutlineDelete size={20} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorPage;