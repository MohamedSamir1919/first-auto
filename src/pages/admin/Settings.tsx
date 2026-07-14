import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Save, CheckCircle, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie'
const Settings = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    arabicTitle: '',
  });

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection & preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    // Prepare Multipart Form Data
    const data = new FormData();
    data.append('name', formData.name);
    data.append('title', formData.title);
    data.append('arabicTitle', formData.arabicTitle);
    data.append('img', file.name);
    if (file) data.append('imgFile', file); // 'img' must match your upload.single('img') in Multer

    try {
      // Using POST as it is standard for file uploads
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/setting/add-banner`, 
        data,
        { headers: { 'Content-Type': 'multipart/form-data'
            ,Authorization:`Bearer ${Cookies.get('token')}`
         } }
      );

      setStatus({ type: 'success', msg: 'Banner added successfully!' });
      console.log("Server Response:", response.data);
    } catch (error) {
      setStatus({ type: 'error', msg: 'Failed to upload banner.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Banner Settings</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Write the name: choose from:["first banner", "second banner", "third banner"], [ "women banner", "men banner"], "shop banner"</label>
            <input 
              name="name" 
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title (EN)</label>
            <input 
              name="title" 
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              required 
            />
          </div>

          {/* Arabic Title Field */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">العنوان بالعربية</label>
            <input 
              name="arabicTitle" 
              dir="rtl"
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-right" 
              required 
            />
          </div>

          {/* File Upload Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload banner image</p>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {status.msg && (
          <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {status.msg}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition flex justify-center items-center gap-2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Save size={20} />
          {loading ? 'Uploading...' : 'Save Banner Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;