import React from 'react'
import { useState, useEffect } from 'react'

function Invoice({ bizName, creditor, creditorAddress, closeInvoice, phoneNumber, invoiceNo }) {
    const [today, setToday] = useState('')
    useEffect(() => {
        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().split("T")[0]
        setToday(formattedDate)
    }, [])
    return (
        // <div className='relative md:left-[12rem] md:-top-[2.3rem] bg-red-700 h-[100vh]'>
        <div className='fixed bg-red-800 inset-0 bg-opacity-40 backdrop-blur-sm flex md:justify-center md:items-center'>
            <div className='relative top-20 left-0 w-[60rem] h-[100vh] bg-white rounded-xl'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className='absolute right-6 top-4 cursor-pointer' onClick={closeInvoice}>
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
                <div className='relative top-10 ml-5'>
                    <h1>{bizName}</h1>
                    <div>
                        <div>
                            <span>{creditor}</span>
                            <h4>{phoneNumber}</h4>
                        </div>
                        <div>
                            <span>Invoice #: {invoiceNo}</span>
                            <span>Date: {today}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Invoice
