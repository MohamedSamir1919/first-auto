import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

type Props = {}

const Posts = (props: Props) => {
  // const posts = [
  //   { id: 1, title: "Just started learning the MERN Stack! Excited for this journey.", date: "May 28, 2026" },
  //   { id: 2, title: "Deep dive into ERPNext and Frappe custom app development today.", date: "May 20, 2026" },
  //   { id: 3, title: "Successfully solved a complex non-linear equation using Python.", date: "May 10, 2026" },
  //   { id: 4, title: "Setting up a secure lab environment using DNSChef and Scapy.", date: "April 25, 2026" },
  //   { id: 5, title: "Reflecting on the power of structural digital relationships in programming.", date: "April 02, 2026" }
  // ];
  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER}/social/posts`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      })
      response.status == 200 && setPosts(response.data);
    }

    catch (err) {
      console.error("Error fetching posts:", err);
    }
  }
  useEffect(() => {
    getPosts();
  }, [])
  // Simulating navigation on click
  const [activePost, setActivePost] = useState(null);
  const Navigate = useNavigate();
  const handlePostClick = (post) => {
    setActivePost(post);
    Navigate(`/post/${post._id}`)
    // In a real app, you would use: navigate(`/post/${post.id}`) from react-router-dom
  };

  return (
    <div className="min-h-screen mt-[100px] bg-gray-100 py-10 px-4 font-sans text-gray-800">

      {/* Profile Header Simulation */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">My Programming Timeline</h1>
        <p className="text-gray-600">A straight-line tree of my thoughts and achievements</p>

        {/* Navigation Feedback Prompt */}
        {activePost && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg animate-pulse">
            🚀 Navigating to post: <strong>"{activePost.title}"</strong> (ID: {activePost.id})
          </div>
        )}
      </div>

      {/* Main Timeline Wrapper */}
      <div className="relative max-w-4xl mx-auto">

        {/* The Center Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500 rounded"></div>

        {/* Loop through posts */}
        <div className="space-y-12">
          {posts?.map((post, index) => {
            // Determine if the item goes to the left or right side
            const isLeft = index % 2 === 0;

            return (
              <div
                key={post._id}
                className={`flex items-center w-full justify-between ${isLeft ? 'flex-row' : 'flex-row-reverse'
                  }`}
              >
                {/* 1. The Post Card Side */}
                <div className="w-[45%]">
                  <div
                    onClick={() => handlePostClick(post)}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
                  >
                    <img className="w-[100px]" src={`${post.pic}`} />

                    <div className="flex flex-col">

                      <span className="text-xs  justify-between font-semibold text-blue-500 uppercase tracking-wider block mb-2">
                        {post.createdAt.split('T')[0]}

                      </span>
                      <span className="text-xs  justify-between font-semibold text-blue-500 uppercase tracking-wider block mb-2">
                        {post.createdAt.split('T')[1].split('.')[0].split(':')[0] + ":" + post.createdAt.split('T')[1].split('.')[0].split(':')[1]}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {post.title}
                    </h3>
                    <div className="mt-4 text-sm text-gray-400 group-hover:text-blue-500 flex items-center gap-1 transition-colors">
                      Read full post <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>

                {/* 2. The Central Node Connector (The dot on the line) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-blue-600 border-4 border-white rounded-full shadow z-10"></div>

                {/* 3. The Empty Balancing Side */}
                <div className="w-[45%] hidden md:block"></div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Posts