import axios from 'axois'
const visitorId = async(source)=>{
    const id = localStorage.getItem("visitorId")
    if(id){
        return id
    }
    else {
        const id = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/visit`,{source:source})
    }
}