import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Props = {}

const Post = (props: Props) => {
    const postId = window.location.pathname.split("/post/")[1];

    const [post, setPost] = useState();
    const getPost = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER}/social/posts`)
            response.status == 200 ? setPost(response.data.filter(p => p._id == postId)[0])
                : ""
        } catch (error) {
            console.error("Error fetching post:", error);
        }
    }
    useEffect(() => { getPost() }, [postId])
    return (
        <div className="mt-[100px]">
            <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
        </div>
    )
}
export default Post