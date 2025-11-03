import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const GalleryAdmin = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [form, setForm] = useState({ title: "", image: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      const { data } = await axios.get("/api/gallery");
      setGalleryItems(data.galleryItems);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch gallery items");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/gallery/${editingId}`, form);
        toast.success("Gallery item updated");
      } else {
        await axios.post("/api/gallery", form);
        toast.success("Gallery item added");
      }
      setForm({ title: "", image: "", description: "" });
      setEditingId(null);
      fetchGallery();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  // Delete gallery item
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`/api/gallery/${id}`);
        toast.success("Gallery item deleted");
        fetchGallery();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete");
      }
    }
  };

  // Edit gallery item
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">{editingId ? "Edit Gallery Item" : "Add New Gallery Item"}</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Gallery Items */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Gallery Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {galleryItems.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow relative">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p>{item.description}</p>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-400 px-2 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 px-2 py-1 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdmin;
