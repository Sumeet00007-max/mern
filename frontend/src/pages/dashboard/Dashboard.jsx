import React, { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import useAuth from '../../hooks/useAuth'
import { getDashboard } from '../../apis/url'

const Dashboard = () => {
  const token = useAuth()
  const [totalClicks, setTotalClicks] = useState(0) 
  const [dateWiseClicks, setDateWiseClicks] = useState({})
  const [deviceTypeClicks, setDeviceTypeClicks] = useState({
    desktop: 0,
    mobile: 0,
    tablet: 0,
  })

  const getData = async ()=>{
    const data = await getDashboard()
    if(data){

      setTotalClicks(data.totalClicks)
      setDateWiseClicks(data.dateWiseClicks)
      setDeviceTypeClicks(data.deviceTypeClicks)
    }
  }

  useEffect(() => {
    console.log(dateWiseClicks)
    getData()
  },[])
  
  const maxClicks = dateWiseClicks
  ? Math.max(...Object.values(dateWiseClicks), 0)
  : 0;

  const maxDeviceClicks = Math.max(deviceTypeClicks?.desktop, deviceTypeClicks?.mobile, deviceTypeClicks?.tablet, 0); // Added this line

  return (
    <main className={styles.dashboard}>
      <div className={styles.totalContainer}>Total clicks: {totalClicks}</div>
      <div className={styles.mainBody}>
        <div className={styles.dataContainer}>
          <h3>Date-wise Clicks</h3>
          <div className={styles.data}>

            
              <div className={styles.graphData}>
            {
                dateWiseClicks ?

                  Object.keys(dateWiseClicks).map((date, index) => (
                  <div key={index} className={styles.dateGraph}>
                    <div>{date}</div>
                    <div className={styles.bar} style={{ width: `${(dateWiseClicks[date] / maxClicks) * 100}%`}}></div>
                    <div className={styles.dateClicks}>{dateWiseClicks[date]}</div>
                  </div>
                ))
                :
                <div>No data yet....</div>
                
              }  
              </div>

          </div>
        </div>
        <div className={styles.dataContainer}>
          <h3>Click Devices</h3>
          <div className={styles.graphData}>
            <div className={styles.dateGraph}>
              <div>Desktop</div>
              <div className={styles.bar} style={{ width: `${(deviceTypeClicks?.desktop / maxDeviceClicks) * 100}%`}}></div>
              <div className={styles.dateClicks}>{deviceTypeClicks?.desktop}</div>
            </div>
            <div className={styles.dateGraph}>
              <div>Mobile</div>
              <div className={styles.bar} style={{ width: `${(deviceTypeClicks?.mobile / maxDeviceClicks) * 100}%`}}></div>
              <div className={styles.dateClicks}>{deviceTypeClicks?.mobile}</div>
            </div>
            <div className={styles.dateGraph}>
              <div>Tablet</div>
              <div className={styles.bar} style={{ width: `${(deviceTypeClicks?.tablet / maxDeviceClicks) * 100}%`}}></div>
              <div className={styles.dateClicks}>{deviceTypeClicks?.tablet}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard