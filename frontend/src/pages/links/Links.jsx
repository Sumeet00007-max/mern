import React, { useEffect, useState } from "react";
import styles from "./Links.module.css";
import { deleteLink, getAllLinks, editLink } from "../../apis/url"; // Added editLink import
import { toast } from "react-toastify";
import Drawer from "../../components/drawer/Drawer";
import Modal from "../../components/Modal/Modal";
import { useSelector } from "react-redux";

const Links = () => {
  const baseUrl = import.meta.env.VITE_BASEURL;
  const { query, results } = useSelector((state) => state.search);

  const [links, setLinks] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  const getLinks = async (page = 1) => {
    try{
      const data = await getAllLinks(page);
      setLinks(data?.data?.data.urls);
      setTotalPages(data?.data?.data.pagination.totalPages); 
      console.log(data.data.data.urls);
    } catch(error){
      setLinks([])
    }
  };

  const deleteUrl = async (id) => {
    const data = await deleteLink(id);
    console.log(data);
    getLinks(currentPage); 
  };

  const handleSortByDate = () => {};

  const handleSortByStatus = () => {};


  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleEditClick = (row) => {
    setSelectedLink(row); 
    toggleDrawer();
  };

  const handleCopyClick = (shortLink) => {
    navigator.clipboard.writeText(`${baseUrl}/url/${shortLink}`);
    toast.success("Link copied to clipboard!");
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  const getStatus = (expirationdate) => {
    const currentDate = new Date();
    const expiryDate = expirationdate ? new Date(expirationdate) : null;

    return !expiryDate || expiryDate > currentDate ? "Active" : "Inactive";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getLinks(page);
  };

  useEffect(() => {
    if (query.length > 0) {
      setLinks(results);
    } else {
      getLinks(currentPage);
    }
  }, [query, results, isModalOpen, isDrawerOpen, currentPage]);

  return (
    <div className={styles.linksContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              Date
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
            <th>Remarks</th>
            <th>Clicks</th>
            <th>
              Status{" "}
              <img
                src="/sorting.png"
                alt="sorting"
                className={styles.sortIcon}
                onClick={handleSortByStatus}
                style={{ cursor: "pointer" }}
              />
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            links.length?
          links?.map((row, index) => (
            <tr key={row._id}>
              <td>{new Date(row.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              <td>{row.destinationUrl.slice(0, 25)}</td>
              <td>
                {`${baseUrl}/url/${row.shortUrl}`.slice(0, 12)}
                <img
                  src="/copy.png"
                  alt="copy"
                  className={styles.copyIcon}
                  onClick={() => handleCopyClick(row.shortUrl)}
                />
              </td>
              <td>{row.remarks}</td>
              <td>{row.clicks}</td>
              <td
                className={
                  getStatus(row.expirationDate) === "Active"
                    ? styles.active
                    : styles.inactive
                }
              >
                {getStatus(row.expirationDate)}
              </td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEditClick(row)} 
                >
                  <img src="/edit.png" alt="edit" className={styles.editIcon} />
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(row._id)} 
                >
                  <img
                    src="/bin.png"
                    alt="Delete"
                    className={styles.deleteIcon}
                  />
                </button>
              </td>
            </tr>
          )):
          <tr>
            <td colSpan="7">No data found</td>
          </tr>
        }
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`${styles.pageButton} ${
              currentPage === index + 1 ? styles.activePage : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Drawer
        heading={selectedLink ? "Edit Link" : "New Link"}
        toggleDrawer={toggleDrawer}
        isOpen={isDrawerOpen}
        data={selectedLink}
        editLink={editLink}
      />

      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          deleteUrl={deleteUrl}
          id={selectedId}
        />
      )}
    </div>
  );
};

export default Links;
