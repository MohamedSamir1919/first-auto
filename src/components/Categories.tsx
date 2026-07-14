import axios from 'axios';
import React, { useEffect, useState } from 'react'
interface ICategory {
    _id: string;
    name: string;
}
const Categories = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    useEffect(() => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER}/category`)
            if (res.status == 200) {
                setCategories(res.data)
            }
        }
        catch (error) {
            console.log(error)
        }

    }, [])
    return (
        <div>

        </div>
    )
}

export default Categories