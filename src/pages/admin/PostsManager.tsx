import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
type Props = {}
// interface IPostForm {
//     _id?:string;
//   title: string;
//   post: string[]; // array of strings (e.g., paragraphs or tags)
//   pics: string[]; // array of image URLs or Base64
//   rate: number;
// }

interface ICommentForm {
    _id?:string;

  title: string;
  comment: string;
  postId: string; // References the Post Object ID
}

const PostsManager = (props: Props) => {
    const [posts, setPosts] = useState([])
    const [postt, setPost] = useState({})
    const [comments , setComments] = useState<ICommentForm[]>([])
    const getPostsAndComments = async () =>{
        try{
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/social/posts`)
            res.status == 200 && setPosts(res.data)
             const res2 = await axios.get(`${import.meta.env.VITE_API_URL}/social/comments`)
            res2.status == 200 && setComments(res2.data)
        }
        catch(err){console.log(err)}
    }
    
    useEffect(()=>{
        getPostsAndComments()
    },[])
    const postPost = async (post) =>{
        try{
            const token = Cookies.get('token')
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/social/post`,post,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
                res.status == 200 && getPostsAndComments()
        }
        catch(err){console.log(err)}
    }


    const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // 1. Handle the file selection event
  const handleFileChange = (event) => {
    // event.target.files is an array-like object. 
    // We grab the first file [0] for a single file upload.
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // 2. Handle the form submission and API call
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    // FormData is required to send binary file data via multipart/form-data
    const formData = new FormData();
    
    // 'file' is the key your backend API will look for
    formData.append('file', selectedFile); 
    formData.append('title', postt.title); 
    formData.append('post', postt.post); 
    formData.append('pic', selectedFile.name); 
    // console.log("postt",postt)

    try {
      console.log(formData)
      setUploadStatus('Uploading...');
      
      // Replace with your actual API endpoint
       const token = Cookies.get('token')
            const res = await axios.post(`${import.meta.env.VITE_SERVER}/social/post`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
                res.status == 200 && alert('post created')
        
      
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed. Network error.');
    }
  };
  // Simulating navigation on click
  return (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* HEADER SECTION */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Content Management Dashboard
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          Create new posts and link corresponding user comments smoothly.
        </p>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: CREATE POST MODEL FORM                        */}
      {/* ========================================================= */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
            <p className="text-xs text-gray-400">Maps directly to mongoose.model("Post")</p>
          </div>
        </div>

        <form className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Post Title</label>
            <input 
              type="text" 
              onClick={(e)=>{setPost(Object.assign(postt,{title:e.target.value}))}}
              placeholder="e.g., Deep dive into MERN Stack" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          {/* Post Body (Array Simulation via Textarea / Multi-line input) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Post Content (Array Paragraphs)</label>
            <textarea 
              rows={4}
              onClick={(e)=>{setPost({...postt,post:e.target.value})}}
              placeholder="Write your main post content here..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div>

          {/* Pics Upload Layout */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Post Pictures (Pics Array)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors group">
              <div
              
              className="space-y-1 relative text-center">
                <input onChange={handleFileChange} type="file" className='flex justify-center items-center cursor-pointer bg-gradient-to-tr from-gray-200 to-gray-500 absolute h-full w-full' />
                <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4-4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {/* <div className="flex text-sm text-gray-600">
                  <span className="relative font-medium text-blue-600 hover:text-blue-500">Upload multiple files</span>
                </div> */}
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>

          {/* Rating Rating Counter */}
          {/* <div className="w-1/3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Post Rating (Rate Number)</label>
            <input 
              type="number" 
              min="0" 
              max="5"
              step="0.1"
              placeholder="5.0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            />
          </div> */}

          {/* Submit Post Button */}
          <div className="pt-2">
            <button 
            onClick={(e)=>{handleUpload(e)}}
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg shadow transition-all transform active:scale-[0.98]"
            >
              Publish Post Model
            </button>
          </div>
        </form>
      </section>


      {/* ========================================================= */}
      {/* SECTION 2: CREATE COMMENT MODEL FORM                      */}
      {/* ========================================================= */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 mb-6">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Comment Reference</h2>
            <p className="text-xs text-gray-400">Maps directly to mongoose.model("Comment")</p>
          </div>
        </div>

        <form className="space-y-5">
          {/* Connected Post Selection (ObjectId Reference) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Target Post ID (Ref: 'Post')</label>
            <select className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-gray-600">
              <option value="">-- Select a Parent Post --</option>
              <option value="60d21b4667d0d8992161c993">Post #1: MERN Stack Guide (60d21b46...)</option>
              <option value="60d21b4a67d0d8992161c994">Post #2: ERPNext Customization (60d21b4a...)</option>
            </select>
          </div>

          {/* Comment Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Comment Heading / User Title</label>
            <input 
              type="text" 
              placeholder="e.g., Anonymous Developer Feedback" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>

          {/* Comment String Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Comment Text Body</label>
            <textarea 
              rows={3}
              placeholder="Type out the specific comment data string..." 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>

          {/* Submit Comment Button */}
          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-lg shadow transition-all transform active:scale-[0.98]"
            >
              Submit Referenced Comment
            </button>
          </div>
        </form>
      </section>

    </div>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* SECTION HEADER */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
          Post Moderation & Content Management
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review live posts, modify database parameters, and approve or refuse pending comments.
        </p>
      </div>

      {/* EXISTING CONTENT MANAGER LOOP */}
      {/* In production, you would map over your posts array here: posts.map((post) => (...)) */}
      <div className="space-y-6">
        
        {/* SINGLE POST CARD INSTANCE */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Post Header & Quick Update Controls */}
          <div className="p-6 bg-gray-50 border-b border-gray-100 sm:flex sm:items-center sm:justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                Rate: 4.8 ★
              </span>
              <h2 className="text-lg font-bold text-gray-900 mt-2">
                {/* Editable Title Bind */}
                <input 
                  type="text" 
                  defaultValue="Deep dive into MERN Stack & ERPNext Customization" 
                  className="bg-transparent font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:bg-white px-1 py-0.5 rounded outline-none transition-all w-full sm:w-96"
                />
              </h2>
              <p className="text-xs text-gray-400">ID: 60d21b4667d0d8992161c993 • Created: 2026-05-28</p>
            </div>
            
            {/* Post Level Actions */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-2">
              <button className="inline-flex items-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Update Post
              </button>
              <button className="inline-flex items-center gap-x-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 transition-colors">
                Delete
              </button>
            </div>
          </div>

          {/* Post Sub-Data View (Pics & Array Snippets) */}
          <div className="p-6 border-b border-gray-100 bg-white space-y-4">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900 block mb-1">Attached Media Assets (pics):</span>
              <div className="flex gap-2">
                <div className="h-14 w-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">pic_1.png</div>
                <div className="h-14 w-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-400">thumbnail.jpg</div>
              </div>
            </div>
          </div>

          {/* NESTED COMMENTS MODERATION INNER SECTION */}
          <div className="bg-gray-50/50 p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Linked Comments Queue
            </h3>

            {/* COMMENT ITEMS */}
            <div className="space-y-3">
              
              {/* Comment Row 1 (Pending Status) */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-amber-200">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">John Doe (Title: Great Summary)</span>
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                      Pending Approval
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "This system implementation layout works absolutely perfectly with the Frappe bench API!"
                  </p>
                </div>
                
                {/* Accept / Refuse Action Handles */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button 
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all"
                  >
                    Accept
                  </button>
                  <button 
                    type="button"
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50 transition-all"
                  >
                    Refuse
                  </button>
                </div>
              </div>

              {/* Comment Row 2 (Already Accepted Instance) */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 opacity-75 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">Alice Smith (Title: Question)</span>
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                      Live / Approved
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    "Do we need a separate server configuration context for handling the Scapy packet injection?"
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button 
                    type="button"
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-200 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    Revoke/Refuse
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
  </div>
);
}

export default PostsManager