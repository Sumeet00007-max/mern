import React, { useEffect, useState } from 'react'
import styles from './Settings.module.css'
import { userUpdate } from '../../apis/user'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()
    const userData = { name, email, mobile }
    const success = await userUpdate(userData)
    if (success) {
      navigate('/auth') // Redirect to login page if email is updated
    }
  }
  useEffect(()=>{
    setName(localStorage.getItem('name'))
    setEmail(localStorage.getItem('email'))
  },[])

  return (
    <main className={styles.settings}>
      <form action="" className={styles.form} onSubmit={handleUpdate}>
        <div className={styles.inputContainer}>
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id='name' 
            placeholder=""
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email Id</label>
          <input 
            type="email" 
            id='email' 
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="mobile">Mobile</label>
          <input 
            type="number" 
            id='mobile' 
            placeholder=""
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type='submit' className={styles.save}>Save changes</button>
          <button className={styles.delete}>Delete account</button>
        </div>
      </form>
    </main>
  )
}

export default Settings