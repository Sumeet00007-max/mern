import React, { useState } from 'react'
import styles from './Auth.module.css'
import image from "../../assets/left.png"
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import Login from '../../components/auth/Login'
import Signup from '../../components/auth/Signup'
const Auth = () => {
  
  const [isSignup, setisSignup] = useState(false)



  const handlesignup = () => {
    setisSignup(true)
  }
  const handlelogin = () => {
    setisSignup(false)
  }
  return (
    <main className={styles.main}>
        <div className={styles.left}>

          <img src={logo} alt='logo' className={styles.logo}/>
          <img src={image} alt='loginImage' className={styles.leftImg}/>
        </div>
        <div className={styles.right}>
          
          <div className={styles.buttonContainer}>
            <button className={styles.signup} onClick={handlesignup}>Sign Up</button>
            <button className={styles.login} onClick={handlelogin}>Login</button>
          </div>

          <div className={styles.formContainer}>
            {isSignup ? 
              <Signup 
                handlelogin={handlelogin}
              />
              : 

              <Login 
                handlesignup={handlesignup}
              />}
          </div>

        </div>
    </main>
  )
}

export default Auth