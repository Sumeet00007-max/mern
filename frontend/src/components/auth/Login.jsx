import React, { useState } from 'react'
import styles from './auth.module.css'
import { userLoginApi } from '../../apis/user';
import { useNavigate } from 'react-router-dom';
const Login = ({handlesignup}) => {
  const navigate = useNavigate()
  const [input, setinput] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState({ email: "", password: "" });



  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const userLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!validateEmail(input.email)) {
      setError({ email: "Invalid email address" });
      return;
    }
    const {token , user} = await userLoginApi(input)
    if(token) {
      navigate('/')
      localStorage.setItem("name",user.name)
      localStorage.setItem("email",user.email)
    }
  }
  

  return (
    <main className={styles.mainContainer}>
        <p>Login</p>

        <form className={styles.form} onSubmit={userLogin}>
            
            <input 
              type="email" 
              id='email'
              placeholder="Email id" 
              value={input.email}
              onChange={(e) => setinput({...input, email: e.target.value})}  
            />
            <label htmlFor="email" className="error">{error.email}</label>
            
            <input 
              type="password" 
              placeholder="Password"
              value={input.password}
              onChange={(e) => setinput({...input, password: e.target.value})}  
            />
            <label htmlFor="password" className="error">{error.password}</label>

            <button type='submit'>Register</button>

            <p>Don’t have an account? <span onClick={handlesignup}>SignUp</span></p>
        </form>

    </main>
  )
}

export default Login