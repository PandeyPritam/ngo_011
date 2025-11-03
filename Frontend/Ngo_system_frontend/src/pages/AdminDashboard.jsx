import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  CheckCircle, UserPlus, Award, Users, Package, Calendar, UserCheck, Trash2,
  TrendingUp, Clock, CheckSquare, UserX, Filter, Phone, Mail, MapPin
} from "lucide-react";

export default function AdminDashboard() {
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assigning, setAssigning] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // ---------------- FETCH FUNCTIONS ----------------
  const fetchAllDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("❌ Failed to fetch donations");
    }
  };

  const fetchAllVolunteers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/volunteers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteers(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("❌ Failed to fetch volunteers");
    }
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    if (!token) return setLoading(false);
    const fetchData = async () => {
      await Promise.all([fetchAllDonations(), fetchAllVolunteers()]);
      setLoading(false);
    };
    fetchData();
  }, [token]);

  // ---------------- ACTION HANDLERS ----------------
  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/donations/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Donation Approved!");
      fetchAllDonations();
    } catch {
      toast.error("❌ Failed to approve donation");
    }
  };

  const handleAssign = async (donationId) => {
    const volunteerId = assigning[donationId];
    if (!volunteerId) return toast.error("⚠️ Select a volunteer first!");
    try {
      await axios.patch(
        `http://localhost:5000/api/donations/${donationId}/assign`,
        { volunteerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🙌 Volunteer Assigned!");
      setAssigning((prev) => ({ ...prev, [donationId]: "" }));
      fetchAllDonations();
    } catch {
      toast.error("❌ Failed to assign volunteer");
    }
  };

  const handleCompletionApproval = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/donations/${id}/approveCompletion`,
        { points: 10 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🏆 Completion Approved & Points Awarded!");
      fetchAllDonations();
    } catch {
      toast.error("❌ Failed to approve completion");
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!window.confirm("🗑️ Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Donation deleted!");
      fetchAllDonations();
    } catch {
      toast.error("❌ Failed to delete donation");
    }
  };

  const handleDeleteVolunteer = async (id) => {
    if (!window.confirm("🗑️ Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/volunteers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Volunteer deleted!");
      fetchAllVolunteers();
    } catch {
      toast.error("❌ Failed to delete volunteer");
    }
  };

  // ---------------- FILTERED DONATIONS ----------------
  const filteredDonations = donations.filter(donation => {
    switch (activeFilter) {
      case "pending": return donation.status === "pending";
      case "approved": return donation.status === "approved";
      case "assigned": return donation.status === "assigned";
      case "completed": return donation.status === "completed";
      default: return true;
    }
  });

  const stats = {
    totalDonations: donations.length,
    pendingDonations: donations.filter((d) => d.status === "pending").length,
    completedDonations: donations.filter((d) => d.status === "completed").length,
    totalVolunteers: volunteers.length,
    assignedDonations: donations.filter((d) => d.status === "assigned").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved": return "bg-blue-100 text-blue-700 border-blue-200";
      case "assigned": return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 font-medium">Loading Dashboard...</p>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen p-6">
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          className: "bg-white border border-gray-200 shadow-xl rounded-xl",
          duration: 3000
        }} 
      />
      
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-slate-900 mb-2"
        >
          Admin Dashboard
        </motion.h1>
        <p className="text-slate-600 text-lg">Manage donations and volunteers efficiently</p>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
      >
        {/* Total Donations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.totalDonations}</p>
              <p className="text-gray-600 text-sm">Total Donations</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-600">All time</span>
          </div>
        </div>

        {/* Pending Donations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingDonations}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-amber-600">Needs approval</span>
          </div>
        </div>

        {/* Assigned Donations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.assignedDonations}</p>
              <p className="text-gray-600 text-sm">Assigned</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-blue-600">In progress</span>
          </div>
        </div>

        {/* Completed Donations */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.completedDonations}</p>
              <p className="text-gray-600 text-sm">Completed</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-purple-600">Ready for review</span>
          </div>
        </div>

        {/* Volunteers */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-cyan-600">{stats.totalVolunteers}</p>
              <p className="text-gray-600 text-sm">Volunteers</p>
            </div>
            <div className="p-3 bg-cyan-100 rounded-xl">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-cyan-600">Active team</span>
          </div>
        </div>
      </motion.div>

      {/* Volunteers Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Volunteer Team</h2>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {volunteers.length} members
          </span>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {volunteers.map((v, index) => (
            <motion.div
              key={v._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {v.userId?.name?.charAt(0) || "U"}
                </div>
                <button
                  onClick={() => handleDeleteVolunteer(v._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Delete Volunteer"
                >
                  <UserX className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-gray-900 truncate">{v.userId?.name || "Unknown User"}</p>
                <p className="text-sm text-gray-500 mt-1">{v.role || "Volunteer"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Donations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Donation Management</h2>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Donations</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No donations found</h3>
            <p className="text-gray-500">Try changing your filter criteria</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDonations.map((d, index) => (
              <motion.div
                key={d._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 capitalize flex items-center gap-2">
                      {d.type}
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        x{d.quantity}
                      </span>
                    </h4>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(d.status)}`}>
                      {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteDonation(d._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Donation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Donor Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Donor:</span>
                    <span>{d.donorId?.name || "N/A"}</span>
                  </div>
                  {d.donorId?.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Phone:</span>
                      <span>{d.donorId.phone}</span>
                    </div>
                  )}
                  {d.donorId?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Email:</span>
                      <span>{d.donorId.email}</span>
                    </div>
                  )}
                  {d.donorId?.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="font-medium">Location:</span>
                      <span>{d.donorId.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(d.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Volunteer:</span>
                    <span className={d.assignedTo ? "text-blue-600" : "text-gray-400"}>
                      {d.assignedTo?.userId?.name || "Not assigned"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {d.status === "pending" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(d._id)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Donation
                    </motion.button>
                  )}
                  
                  {d.status === "approved" && (
                    <>
                      <select
                        value={assigning[d._id] || ""}
                        onChange={(e) => setAssigning((prev) => ({ ...prev, [d._id]: e.target.value }))}
                        className="w-full border border-gray-200 bg-white p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select volunteer...</option>
                        {volunteers.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.userId?.name} - {v.role}
                          </option>
                        ))}
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAssign(d._id)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign Volunteer
                      </motion.button>
                    </>
                  )}

                  {d.status === "completed" && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCompletionApproval(d._id)}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Award className="w-4 h-4" />
                      Approve & Award Points
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
