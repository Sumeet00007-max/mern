import React, { useEffect, useState } from 'react'
import styles from './Header.module.css'
import Drawer from '../drawer/Drawer'
import { createLink, searchUrl } from '../../apis/url' // Added searchUrl import
import { useNavigate } from 'react-router-dom'
import { setSearchQuery } from '../../store/slices/searchSlice'
import { useDispatch } from 'react-redux'

const Header = () => {

  const [greeting, setGreeting] = useState('')
  const [day, setDay] = useState('')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [name, setName] = useState('')
  const [searchQuery, setSearchQueryLocal] = useState('');
  const [islogoutOpen, setIsLogoutOpen] = useState(false)

  const dispatch = useDispatch();
  const navigation = useNavigate()

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return '⛅️  Good morning';
    } else if (currentHour < 18) {
      return '☀️  Good afternoon';
    } else {
      return '🌘  Good evening';
    }
  }
  const getCurrentDate = () => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }

  const createNewLink = async ( data ) => {
    const res =  await createLink(data)
    console.log(res)
    return res
  }
  const handleLogout = () => {
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    navigation('/auth')
  }

  const handleSearch = async (e) => { 
    const query = e.target.value// Modified this function
    setSearchQueryLocal(query)
    if (query) {
      const results = await searchUrl(query);
      console.log(results)
      dispatch(setSearchQuery({ query, results }));  // Store in Redux
    } else {
      dispatch(setSearchQuery({ query: '', results: [] })); // Clear search
    }

    navigation('/links')
  }

  useEffect(() => {
    setGreeting(getGreeting())
    setDay(getCurrentDate())
    setName(localStorage.getItem('name'))
  },[])

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <div className={styles.header}>
      <div className={styles.greeting}>
        <div>{greeting}, {name}</div>
        <p>{day}</p>
      </div>
      <div className={styles.headerFunc}>
        <button onClick={toggleDrawer}>+ Create New</button> 
        <input 
          type='text' 
          placeholder='search by remarks'  
          value={searchQuery}
          onChange={handleSearch}
        />
        <div 
          className={styles.avatar}
          onClick={() => setIsLogoutOpen( prev => !prev)}
        >{name ?  name.slice(0,2).toUpperCase(): ""}</div>
      </div>
      {islogoutOpen && <div className={styles.logout}>
        <button onClick={handleLogout}>Logout</button>
      </div>}
      <Drawer 
        heading='New Link'
        toggleDrawer={toggleDrawer} 
        isOpen={isDrawerOpen}
        createNewLink={createNewLink}
      /> 
    </div>
  )
}

export default Header