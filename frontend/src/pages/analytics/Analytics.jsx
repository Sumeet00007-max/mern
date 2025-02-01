import React, { useEffect, useState } from "react";
import styles from "./Analytics.module.css";
import { getAnalytics } from "../../apis/url";

export const Analytics = () => {
  const baseUrl = import.meta.env.VITE_BASEURL;

  const [analytics, setAnalytics] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSortByStatus = () => {}
  const handleSortByDate = () => {}

  const loadAnalytics = async (page = 1) => {
    try{
      const data = await getAnalytics(page);
      setAnalytics(data?.analytics);
      setTotalPages(data?.pagination.totalPages);
      console.log(data?.analytics);
    } catch (error) {
      console.log(error);
      setAnalytics([]);
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    loadAnalytics(page);
  };

  useEffect(() => {
    loadAnalytics(currentPage);
  }, [currentPage]);

  return (
    <div className={styles.analytics}>
      <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    Timestamp
                    <img
                      src="/sorting.png"
                      alt="sorting"
                      className={styles.dateSortIcon}
                      onClick={handleSortByDate}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>IP Address</th>
                  <th>User Device</th>
                  
                </tr>
              </thead>
              <tbody>
                {
                  analytics.length ? 
                  analytics.map((row, index)=>(
                    <tr key={row.timestamp+ index}>
                      <td>{row.timestamp}</td>
                      <td>{row.destinationUrl.slice(0,25)+'...'}</td>
                      <td>
                        {`${baseUrl}/url/${row.shortUrl}`}
                      </td>
                      <td>{row.ipAddress}</td>
                      <td>{row.userOS}</td>
                    
                  </tr>
                  ))
                  :
                  <tr>
                    <td colSpan="5">No data found</td>
                  </tr>
                }
                  
              </tbody>
            </table>
      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
