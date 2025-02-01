import React from 'react'
import styles from './Layout.module.css'
import Sidebar from '../../components/sidebar/Sidebar'
import Header from '../../components/header/Header'
import { Outlet } from 'react-router-dom'


const Layout = () => {
    return (
        <main className={styles.dashboard}>
            <Sidebar />
            
            <div className={styles.main}>
                <Header />

                <div className={styles.pages}>
                    <Outlet/>
                </div>
            </div>
        </main>
    )
}

export default Layout