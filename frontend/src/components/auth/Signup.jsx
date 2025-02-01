import React, { useState } from 'react'
import styles from './auth.module.css'
import { userSignupApi } from '../../apis/user'
import { toast } from 'react-toastify'


const Signup = ({handlelogin}) => {

    const [input, setinput] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validate = () => {
        if (!input.name) {
            return 'Name is required'
        }
        if (!validateEmail(input.email)) {
            return 'Invalid email address'
        }
        if (!input.mobile) {
            return 'Mobile number is required'
        }
        if (input.password.length < 6) {
            return 'Password must be at least 6 characters'
        }
        if (input.password !== input.confirmPassword) {
            return 'Passwords do not match'
        }
        return ''
    }

    const userSignup = async (e) => {
        e.preventDefault()
        setError('')
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            toast.error(error)
            return
        } 
        const flag = await userSignupApi(input)
        if(flag){ 

            handlelogin()
        }
    }
    

    return (
        <main className={styles.mainContainer}>
                <p>Join us Today!</p>
        
                <form className={styles.form} onSubmit={userSignup}>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={input.name}
                        onChange={(e) => setinput({...input, name: e.target.value})}
                    />
                    <input 
                        type="email" 
                        placeholder="Email id"
                        value={input.email}
                        onChange={(e) => setinput({...input, email: e.target.value})}    
                    />
                    <input 
                        type="number" 
                        placeholder="Mobile no."
                        value={input.mobile}
                        onChange={(e) => setinput({...input, mobile: e.target.value})}    
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        value={input.password}
                        onChange={(e) => setinput({...input, password: e.target.value})}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm Password"
                        value={input.confirmPassword}
                        onChange={(e) => setinput({...input, confirmPassword: e.target.value})}
                    />
                    {error && <p className="error">{error}</p>}
                    <button>Register</button>
        
                    <p>Already have an account? <span onClick={handlelogin}>Login</span></p>
                </form>
        
            </main>
    )
}

export default Signup