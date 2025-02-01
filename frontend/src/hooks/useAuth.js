import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useAuth = () => {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to access this page');
            navigate('/auth');
        } else {
            setToken(token);
        }
    }, [navigate]);

    return token;
};

export default useAuth;