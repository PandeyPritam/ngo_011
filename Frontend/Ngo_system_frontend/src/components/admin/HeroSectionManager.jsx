import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const HeroAdmin = () => {
  const [heroes, setHeroes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    ctaText: "",
    ctaLink: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all heroes
  const fetchHeroes = async () => {
    try {
      const { data } = await axios.get("/api/heroes");
      setHeroes(data.heroes);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch heroes");
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update Hero
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/heroes/${editingId}`, form);
        toast.success("Hero updated successfully");
      } else {
        await axios.post("/api/heroes", form);
        toast.success("Hero created successfully");
      }
      setForm({ title: "", subtitle: "", image: "", ctaText: "", ctaLink: "" });
      setEditingId(null);
      fetchHeroes();
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  // Delete hero
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hero?")) {
      try {
        await axios.delete(`/api/heroes/${id}`);
        toast.success("Hero deleted successfully");
        fetchHeroes();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete hero");
      }
    }
  };

  // Edit hero
  const handleEdit = (hero) => {
    setForm(hero);
    setEditingId(hero._id);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">{editingId ? "Edit Hero" : "Add New Hero"}</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="subtitle"
          placeholder="Subtitle"
          value={form.subtitle}
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
        <input
          type="text"
          name="ctaText"
          placeholder="CTA Text"
          value={form.ctaText}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="ctaLink"
          placeholder="CTA Link URL"
          value={form.ctaLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Hero" : "Add Hero"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-4">Existing Heroes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {heroes.map((hero) => (
          <div key={hero._id} className="border p-4 rounded shadow relative">
            <img src={hero.image} alt={hero.title} className="w-full h-40 object-cover rounded mb-2" />
            <h3 className="font-bold text-lg">{hero.title}</h3>
            <p>{hero.subtitle}</p>
            <a href={hero.ctaLink} className="text-blue-600">{hero.ctaText}</a>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(hero)}
                className="bg-yellow-400 px-2 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(hero._id)}
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

export default HeroAdmin;
