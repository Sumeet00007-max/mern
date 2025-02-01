import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const baseUrl = import.meta.env.VITE_BASEURL

export const createLink = async (data) => {
    try {
        const response = await axios.post(`${baseUrl}/url/shorten`, data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(response.data.status == "success"){
            toast.success(response.data.message)
            return response.data
        } else {
            toast.error(response.data.message)
            return response.data
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error)
        return;
    }
}

export const getAllLinks = async (page = 1) => {
    try {
        const data = await axios.get(`${baseUrl}/url/all?page=${page}`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(data);
        return data;

    } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error)
        return [];
    }
}

export const getDashboard = async ()=> {
    try {
        const data = await axios.get(`${baseUrl}/url/dashboard`,{
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        // console.log(data)
        if(data.status === 200){
            return data.data
        } else {
            toast.error(data.data.message)
            return data
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
}
export const deleteLink = async (id) => {
    try {
        const data = await axios.delete(`${baseUrl}/url/delete/${id}`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        const response = data.data;
        console.log(data)
        if(response.status == "success"){
            toast.success(response.message)
            return response
        } else {
            toast.error(response.message)
            return response
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error)
        return;
    }
}

export const editLink = async (id, data) => {
    try {
        const response = await axios.put(`${baseUrl}/url/edit/${id}`, data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(response.data.status == "success"){
            toast.success(response.data.message)
            return response.data
        } else {
            toast.error(response.data.message)
            return response.data
        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error)
        return;
    }
}

export const getAnalytics = async (page = 1) => {
    try {
        const data = await axios.get(`${baseUrl}/url/analytics?page=${page}`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(data);
        return data.data;

    } catch (error) {
        toast.error(error?.response?.data?.message)
        console.log(error)
        return [];
    }
}

export const searchUrl = async (searchQuery) => {
    try {
        const response = await axios.get(`${baseUrl}/url/search/${searchQuery}`, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if(response.data.status == "success"){
            return response.data.data;
        } else {
            toast.error(response.data.message);
            return [];
        }
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
        return [];
    }
}


