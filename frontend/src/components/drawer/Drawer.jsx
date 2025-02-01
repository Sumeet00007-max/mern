import React, { useState, useEffect } from 'react'
import styles from './Drawer.module.css'
import { toast } from 'react-toastify'

const Drawer = ({ toggleDrawer, isOpen, heading, data, createNewLink, editLink }) => { // Added editLink prop

    const [input, setInput] = useState({
        destinationUrl: '',
        remarks: '',
        linkExp: false,
        expirationDate: new Date().toISOString().split('T')[0] // yyyy-mm-dd format
    })

    useEffect(() => {
        if (data) {
            setInput({
                destinationUrl: data.destinationUrl || '',
                remarks: data.remarks || '',
                linkExp: !!data.expirationDate,
                expirationDate: data.expirationDate ? new Date(data.expirationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            })
        }
    }, [data])

    const isValid = (url, remarks) => {
        const pattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./?%&=]*)?$/i;
        return pattern.test(url) && remarks?.length > 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isValid(input.destinationUrl, input.remarks)) {
            if (data) {
                editLink(data._id, {
                    ...input,
                    expirationDate: input.linkExp ? input.expirationDate : null
                })
            } else {
                createNewLink({
                    ...input,
                    expirationDate: input.linkExp ? input.expirationDate : null
                })
            }
            console.log("data sent", input)
            toggleDrawer()
        } else {
            toast.error('Invalid URL or add remarks')
        }
    }

    const toggleDate = () => {
        setInput({ ...input, linkExp: !input.linkExp })
    }

    return (
        <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            <div className={styles.drawerHeader}>
                <h4>{heading}</h4>
                <button onClick={toggleDrawer}>X</button>
            </div>

            <div className={styles.drawerBody}>
                <form action="" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Destination Url <span>*</span></label>
                        <input
                            type="url"
                            id='title'
                            placeholder="Title"
                            required
                            value={input.destinationUrl}
                            onChange={(e) => setInput({ ...input, destinationUrl: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="url">Remarks <span>*</span></label>
                        <textarea
                            type="text"
                            id='remarks'
                            placeholder="Url"
                            required
                            value={input.remarks}
                            onChange={(e) => setInput({ ...input, remarks: e.target.value })}
                        />
                    </div>

                    <div className={styles.linkExp}>
                        <label htmlFor="linkexp">Link expiration</label>
                        <input
                            type="checkbox"
                            name="linkexp"
                            id="linkexp"
                            checked={input.linkExp} // Changed this line
                            onChange={(e) => setInput({ ...input, linkExp: e.target.checked })}
                        />
                    </div>

                    {input.linkExp && <div>
                        <input
                            type="date"
                            name=""
                            id="date"
                            value={input.expirationDate}
                            onChange={(e) => setInput({ ...input, expirationDate: e.target.value })}
                        />
                    </div>}
                </form>
            </div>

            <div className={styles.drawerFooter}>
                <button
                    onClick={() => {
                        setInput({
                            destinationUrl: '',
                            remarks: '',
                            linkExp: false,
                            expirationDate: new Date().toISOString().split('T')[0] // yyyy-mm-dd format
                        })
                    }}
                    className={styles.clearButton}
                >clear</button>
                <button
                    onClick={handleSubmit}
                    className={styles.createButton}
                >{data ? 'Update Link' : 'Create New'}</button> {/* Modified this line */}
            </div>
        </div>
    )
}

export default Drawer