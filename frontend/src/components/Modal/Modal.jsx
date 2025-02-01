import React from 'react'
import styles from './Modal.module.css'

const Modal = ({ isModalOpen, setIsModalOpen, deleteUrl, id }) => { // Added id prop

  const handleDelete = () => {
    deleteUrl(id); // Call deleteUrl with id
    setIsModalOpen(false); // Close the modal
  }

  return (
    <div className={styles.modal}>
        <div className={styles.modalContent}>
            <div className={styles.modalBody}>
                <h4>Are you sure you want to remove it?</h4>
                <div className={styles.modalButtons}>
                    <button className={styles.no}
                        onClick={() => setIsModalOpen(false)}
                    >No</button>
                    <button className={styles.yes} onClick={handleDelete}>Yes</button> {/* Added onClick handler */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Modal