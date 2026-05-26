import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const categories = ['Electronics', 'Clothing', 'Books', 'Accessories', 'Other'];

const InputField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-gray-50 focus:bg-white";

const PostItemPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    location: '',
    date: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('type', formData.type);
      data.append('location', formData.location);
      data.append('date', formData.date);
      if (image) data.append('image', image);

      await api.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Item posted successfully!');
      navigate('/my-posts');
    } catch (err) {
      // setError(err.response?.data?.message || 'Something went wrong');
      toast.error(err.response?.data?.message || 'Something went wrong');
      setError(''); // remove the inline error state entirely if you want
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Report an Item</h1>
        <p className="text-sm text-gray-500 mt-1">Fill in the details to post a lost or found item</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Type Toggle */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Type</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50 p-1 gap-1">
              {['lost', 'found'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t })}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all duration-200 ${
                    formData.type === t
                      ? t === 'lost'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {t === 'lost' ? '😟 Lost' : '🎉 Found'}
                </button>
              ))}
            </div>
            {!formData.type && (
              <p className="text-xs text-gray-400 mt-1">Please select Lost or Found</p>
            )}
          </div>

          {/* Title */}
          <InputField label="Title">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Black leather wallet"
              className={inputClass}
            />
          </InputField>

          {/* Description */}
          <InputField label="Description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the item in detail — color, brand, distinctive features..."
              className={`${inputClass} resize-none`}
            />
          </InputField>

          {/* Category */}
          <InputField label="Category">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </InputField>

          {/* Location */}
          <InputField label="Location">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Main Library, Block B Canteen"
              className={inputClass}
            />
          </InputField>

          {/* Date */}
          <InputField label="Date">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </InputField>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Photo <span className="text-gray-400 font-normal">(optional)</span>
            </label>

            <label className="block w-full cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl transition-all duration-200 ${
                preview ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50'
              }`}>
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Change photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500">Click to upload a photo</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.type}
            className="btn-primary w-full py-3 rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Posting...
              </span>
            ) : 'Post Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItemPage;