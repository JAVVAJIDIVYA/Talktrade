import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { FiPlus, FiX, FiUpload } from "react-icons/fi";
import { gigAPI } from "../utils/api";

const AddGig = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    category: "",
    price: "",
    cover: "",
    images: [],
    shortTitle: "",
    shortDesc: "",
    deliveryTime: "",
    revisionNumber: "",
    features: [],
  });
  const [feature, setFeature] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const mutation = useMutation({
    mutationFn: (data) => gigAPI.createGig(data),
    onSuccess: () => {
      navigate("/mygigs");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFeature = () => {
    if (feature.trim() && !formData.features.includes(feature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, feature.trim()],
      });
      setFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()],
      });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const gigData = {
      ...formData,
      price: parseInt(formData.price),
      deliveryTime: parseInt(formData.deliveryTime),
      revisionNumber: parseInt(formData.revisionNumber),
    };
    mutation.mutate(gigData);
  };

  const categories = [
    { value: "design", label: "Graphics & Design" },
    { value: "marketing", label: "Digital Marketing" },
    { value: "writing", label: "Writing & Translation" },
    { value: "video", label: "Video & Animation" },
    { value: "programming", label: "Programming & Tech" },
    { value: "business", label: "Business" },
    { value: "music", label: "Music & Audio" },
    { value: "ai", label: "AI Services" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Create a New Gig
          </h1>
          <p className="text-gray-500 mb-8">
            Fill out the form below to create your service listing
          </p>

          {mutation.isError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {mutation.error?.response?.data?.message || "Something went wrong!"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gig Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="I will design a professional logo for your business"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="100"
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum ₹100</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Time (days) *
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revisions *
                </label>
                <input
                  type="number"
                  name="revisionNumber"
                  value={formData.revisionNumber}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe your service in detail..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Short Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Title *
                </label>
                <input
                  type="text"
                  name="shortTitle"
                  value={formData.shortTitle}
                  onChange={handleChange}
                  required
                  placeholder="Logo Design"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <input
                  type="text"
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleChange}
                  required
                  placeholder="Professional logo design service"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image URL *
              </label>
              <input
                type="url"
                name="cover"
                value={formData.cover}
                onChange={handleChange}
                required
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formData.cover && (
                <img
                  src={formData.cover}
                  alt="Cover preview"
                  className="mt-2 w-40 h-24 object-cover rounded-lg"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Images (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (What's Included)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  placeholder="e.g., Source files included"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.features.map((feat, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {feat}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
              >
                {mutation.isPending ? "Creating..." : "Create Gig"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGig;
