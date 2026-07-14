import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Search, Upload, Trash2, Filter, CheckCircle, XCircle, Image as ImageIcon, Send, Plus } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios'; // تم استيراد Axios

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [filters, setFilters] = useState({ name: '', arabicName: '', active: 'all' });

  // --- حالات الفورم اليدوي الجديد ---
  const [newCollection, setNewCollection] = useState({ name: '', arabicName: '', active: true });
  const [singleImage, setSingleImage] = useState(null);
  const [singleImagePreview, setSingleImagePreview] = useState(null);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const slugExcelInputRef = useRef(null); // ريف لشيت السلاجز

  // get collections
  const getCollections = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/collection`)
      if (res.status == 200) {
        setCollections(res.data);
      }
      else {
        console.log(res.data)
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getCollections();
  }, [])

  // --- [تعديل] 1. إضافة كوليكشن مفرد (يدوياً) ---
  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSingleImage(file);
      setSingleImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCollectionManual = async (e) => {
    e.preventDefault();
    if (!newCollection.name || !newCollection.arabicName) {
      alert("Please fill in both English and Arabic names");
      return;
    }

    const formData = new FormData();
    // تحويل البيانات لنفس التنسيق اللي السيرفر مستنيه
    const textData = [{
      id: Date.now(),
      name: newCollection.name,
      arabicName: newCollection.arabicName,
      active: newCollection.active
    }];

    formData.append('collectionsData', JSON.stringify(textData));
    if (singleImage) {
      // بنبعتها باسم images زي ما السيرفر مستني في الـ Bulk
      formData.append('images', singleImage, `${newCollection.name.replace(/\s+/g, '-').toLowerCase()}.jpg`);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/collection/add-collection`,
        formData,
        { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Collection Added Successfully!");
        // إضافة العنصر الجديد للجدول تحت
        setCollections(prev => [...prev, {
          id: Date.now(),
          name: newCollection.name,
          arabicName: newCollection.arabicName,
          active: newCollection.active,
          imgPreview: singleImagePreview || 'https://via.placeholder.com/40'
        }]);
        getCollections();
        // تصفير الفورم
        setNewCollection({ name: '', arabicName: '', active: true });
        setSingleImage(null);
        setSingleImagePreview(null);
      }
    } catch (err) {
      console.error("Failed to add collection", err);
      alert("Error adding collection: " + (err.response?.data?.message || err.message));
    }
  };


  // --- 2. Handle Excel Upload (Bulk Collections) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);

      const formattedData = data.map((item, index) => ({
        id: Date.now() + index,
        name: item.name || '',
        arabicName: item.arabicName || '',
        imgFile: null,
        imgPreview: 'https://via.placeholder.com/40',
        active: String(item.active).toLowerCase() === 'true',
      }));
      setCollections([...collections, ...formattedData]);
    };
    reader.readAsBinaryString(file);
  };

  // --- 3. Handle Bulk Image Upload ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setCollections(prev => prev.map(col => {
      const matchedFile = files.find(f =>
        f.name.split('.')[0].toLowerCase() === col.name.toLowerCase()
      );
      if (matchedFile) {
        return {
          ...col,
          imgFile: matchedFile,
          imgPreview: URL.createObjectURL(matchedFile)
        };
      }
      return col;
    }));
  };

  // --- 4. Sync Bulk Collections With API ---
  const syncWithApi = async () => {
    const formData = new FormData();
    const textData = collections.map(({ id, name, arabicName, active }) => ({
      id, name, arabicName, active
    }));

    formData.append('collectionsData', JSON.stringify(textData));

    collections.forEach((col) => {
      if (col.imgFile) {
        const fileSlug = col.name.replace(/\s+/g, '-').toLowerCase();
        formData.append(`images`, col.imgFile, `${fileSlug}.jpg`);
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER}/collection/add-collection`,
        formData,
        { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
      );
      if (response.status === 200) alert("Sync Complete!");
    } catch (err) {
      console.error("Sync failed", err);
      alert("Sync failed");
    }
  };

  // --- [جديد] 5. رفع شيت الـ Slugs والـ Collections ومزامنتها فوراً ---
  const handleSlugExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);

        // تحويل البيانات للشكل المطلوب: { slug: "...", collection: "..." }
        const formattedSlugs = data.map(item => ({
          slug: String(item.slug || '').trim(),
          collection: String(item.collection || '').trim()
        })).filter(item => item.slug && item.collection); // فلترة الصفوف الفاضية

        if (formattedSlugs.length === 0) {
          alert("No valid slug/collection data found in Excel.");
          return;
        }

        // إرسال المصفوفة فوراً للـ API المطلوب
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER}/collection/add-collection-slugs`,
          { slugsData: formattedSlugs }, // بيبعتها كـ JSON Body عادي
          { headers: { 'Authorization': `Bearer ${Cookies.get('token')}` } }
        );

        if (response.status === 200 || response.status === 201) {
          alert(`Successfully synced ${formattedSlugs.length} slugs to collections!`);
        }
      } catch (err) {
        console.error("Slugs Sync failed", err);
        alert("Failed to sync slugs: " + (err.response?.data?.message || err.message));
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredCollections = collections.filter(item => {
    return (
      item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.arabicName.toLowerCase().includes(filters.arabicName.toLowerCase()) &&
      (filters.active === 'all' || String(item.active) === filters.active)
    );
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* صف الإدخال اليدوي والشيتات السريعة */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* كارت 1: إضافة كوليكشن يدوي */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" /> Add New Collection (Manually)
            </h2>
            <form onSubmit={handleAddCollectionManual} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">English Name</label>
                <input
                  type="text"
                  value={newCollection.name}
                  onChange={e => setNewCollection({ ...newCollection, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                  placeholder="e.g. Summer Collection"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Arabic Name</label>
                <input
                  type="text"
                  value={newCollection.arabicName}
                  onChange={e => setNewCollection({ ...newCollection, arabicName: e.target.value })}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm outline-none text-right"
                  placeholder="مثال: مجموعة الصيف"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Collection Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSingleImageChange}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                {singleImagePreview && (
                  <img src={singleImagePreview} alt="preview" className="w-12 h-12 rounded-lg object-cover border mt-4" />
                )}
              </div>
              <div className="flex items-center justify-between pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={newCollection.active}
                    onChange={e => setNewCollection({ ...newCollection, active: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  Is Active
                </label>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow transition-all">
                  Save Collection
                </button>
              </div>
            </form>
          </div>

          {/* كارت 2: رفع شيت الـ Slugs للربط */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <LinkIcon size={20} className="text-amber-500" /> Link Slugs via Excel
              </h2>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Upload an Excel sheet containing <b className="text-gray-700">slug</b> and <b className="text-gray-700">collection</b> columns to bulk link products to their categories instantly.
              </p>
            </div>

            <div>
              <button
                onClick={() => slugExcelInputRef.current.click()}
                className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-4 py-3 rounded-xl font-medium transition-all text-sm"
              >
                <Upload size={18} /> Upload Slugs Sheet
              </button>
              <input
                type="file"
                ref={slugExcelInputRef}
                onChange={handleSlugExcelUpload}
                className="hidden"
                accept=".xlsx, .xls"
              />
            </div>
          </div>

        </div>

        {/* الكارت الرئيسي لإدارة البلك (جدول التحكم القديم) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Bulk Collections Management</h1>
              <p className="text-xs text-gray-500">Upload excel sheets and match folder images here</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <Upload size={16} /> Bulk Excel
              </button>

              <button
                onClick={() => imageInputRef.current.click()}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                <ImageIcon size={16} /> Match Bulk Images
              </button>

              <button
                onClick={syncWithApi}
                disabled={collections.length === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadowdisabled:opacity-50"
              >
                <Send size={16} /> Sync Bulk to Server
              </button>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
          </div>

          {/* الفلاتر */}
          <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Filter by Name..."
              value={filters.name}
              onChange={e => setFilters({ ...filters, name: e.target.value })}
              className="p-2 border rounded-lg text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Filter by Arabic Name..."
              value={filters.arabicName}
              onChange={e => setFilters({ ...filters, arabicName: e.target.value })}
              className="p-2 border rounded-lg text-sm outline-none text-right"
            />
            <select
              value={filters.active}
              onChange={e => setFilters({ ...filters, active: e.target.value })}
              className="p-2 border rounded-lg text-sm outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* الجدول */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 w-24">Preview</th>
                  <th className="px-6 py-4">English Name</th>
                  <th className="px-6 py-4">Arabic Name</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCollections.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-sm text-gray-400">No collections loaded yet.</td>
                  </tr>
                ) : (
                  filteredCollections.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/30 text-sm">
                      <td className="px-6 py-4">
                        <div className="relative w-10 h-10">
                          <img src={item.imgPreview} alt={item.name} className="w-10 h-10 rounded-full object-cover border" />
                          {item.imgFile && <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600 text-right font-medium">{item.arabicName}</td>
                      <td className="px-6 py-4">
                        {item.active ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle size={14} /> Active</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-md text-xs font-medium"><XCircle size={14} /> Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

// أيقونة مساعدة للربط
const LinkIcon = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

export default Collections;