import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../Context/auth'
import { toast } from 'react-toastify';
import { useReactToPrint } from "react-to-print";
import { baseUrl, thousandSeperator } from '../Utilities/helper'
import axios from 'axios'

function Invoice({ creditor, stock, closeInvoice }) {
    const [today, setToday] = useState('')
    const [desc, setDesc] = useState([])
    const [itemName, setItemName] = useState("")
    const [invoiceId, setInvoiceId] = useState('')
    const [isToggle, setIsToggle] = useState(false)
    const [item, setItem] = useState({})
    const [invoiceItem, setInvoiceItem] = useState([])
    const [print, setPrint] = useState(false)
    const [invoiceData, setInvoiceData] = useState([])
    const [paymentMethod, setPaymentMethod] = useState("")
    const [invoiceInput, setInvoiceInput] = useState({
        qty: "",
        rate: "",
    })
    const auth = useAuth()
    const { fullName, businessName } = auth.user
    const { firstName, lastName, phoneNumber, createdBy, _id } = creditor
    console.log(_id, "creditor id")
    const baseUrlPost = baseUrl + '/invoice';

    useEffect(() => {
        const baseUrl5 = baseUrl + `/stock/${createdBy}`
        const currentDate = new Date()
        const formattedDate = currentDate.toISOString().split("T")[0]
        setToday(formattedDate)


        const randomNum = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
        const word = businessName.split(' ')
        let f = word[0][0].toUpperCase()
        let l = word[1] ? word[1][0].toUpperCase() : ""
        const invoiceNo = f + l + "-" + randomNum
        setInvoiceId(invoiceNo)


        axios.get(baseUrl5).then((response) => {
            setDesc(response?.data?.Stock)
        }).catch((error) => {
            toast.error(error.response.data.message || "Something went wrong, try aain later!")
        })
    }, [businessName, createdBy])

    const submitHandler = (e) => {
        e.preventDefault()
        console.log(invoiceInput.qty, invoiceInput.rate, item.goods, "ffffffffff")
        if (!invoiceInput.qty || !invoiceInput.rate || !item.goods) {
            toast.error("Please complete the item details before adding.");
            return;
        }

        const newItem = {
            id: new Date().getMilliseconds(),
            description: item.goods,
            category: item.category,
            qty: parseInt(invoiceInput.qty, 10),
            rate: parseFloat(invoiceInput.rate),
            unit: isToggle ? "crt" : "pcs",
            total: invoiceInput.qty * invoiceInput.rate,
        }

        const newInvoiceData = {
            ...newItem,
            businessId: createdBy,
            invoiceId,
            creditorId: _id,
            date: new Date(),
            paymentMethod: paymentMethod || "cash",
            businessPhone: auth?.user?.phoneNumber,
            crditorPhone: phoneNumber,
            businessName,
            ownerName: fullName,
            creditorName: `${firstName} ${lastName}`,
        }

        setInvoiceItem((prev) => [...prev, newItem]);
        setInvoiceData((prev) => [...prev, newInvoiceData])
        setInvoiceInput({ qty: "", rate: "" });
        setItemName("");
        setItem({});
        setIsToggle(false)
    }
    console.log(invoiceInput, "input item here", invoiceItem, "creditor", invoiceData, "xxxxxxxx", auth?.user)

    const itemNameHandler = (value) => {
        setItemName(value?.goods || value?.category)
        console.log(value, "choosen item")
        setInvoiceInput({
            qty: 1,
            rate: value?.sellingPrice
        })
        setItem(value)
    }

    const amountToggle = () => setIsToggle(!isToggle)

    const onChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        // setInvoiceInput({
        //     ...invoiceInput, [name]: value
        // })
        setInvoiceInput((prev) => ({
            ...prev, [name]: value
        }));
    }

    const paymentHandler = (e) => {
        const { name, checked } = e.target;
        setPaymentMethod((prev) => {
            const updated = checked
                ? [...prev, name]
                : prev.filter((method) => method !== name)
            return updated;
        });
    }



    const viewPrintHandler = (e) => {
        e.preventDefault()
        if (invoiceData.length === 0) {
            toast.error("Add at least one item beofre printing")
            return;
        }
        setPrint(true)
    }

    //////////////////print///////////////
    const componentRef = React.useRef(null);

    const handleAfterPrint = React.useCallback(() => {
        console.log("`onAfterPrint` called");
    }, []);

    console.log(invoiceData, "invoice")
    // const handleBeforePrint = React.useCallback(() => {
    //     console.log("`onBeforePrint` called", invoiceData);
    //     axios({
    //         method: 'post',
    //         url: baseUrlPost,
    //         data: invoiceData
    //     }).then((result) => {
    //         console.log(result, 'invoice posted')
    //         toast.success('Invoice saved successfully')
    //     }).catch(error => {
    //         console.log(error, "invoice error")
    //         toast.error(error.response.data.message || "There is an error while savine the invoice, try again later")
    //     })
    //     return Promise.resolve();
    // }, []);

    const handleBeforePrint = React.useCallback(() => {
        if (invoiceData.length === 0) {
            toast.error('No data to save')
            return Promise.reject();
        }
        return axios
            .post(baseUrlPost, invoiceData)
            .then((result) => {
                toast.success('invoice saved successfully')
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || 'Error saving invoice, try aain later')
            })
    }, [invoiceData, baseUrlPost])

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "Invoice",
        onAfterPrint: handleAfterPrint,
        onBeforePrint: handleBeforePrint,
    });
    /////////////////////////////////////////////////

    const renderInvoice = invoiceItem.map((item, idx) => {
        return (
            <>
                <tr key={item.id} className='hover:bg-gray-100'>
                    <td className='p-2 text-left border border-gray-400 w-1/12'>{idx + 1}</td>
                    <td className='align relative w-1/3 p-2 text-left border border-gray-400'>{item?.description}</td>
                    <td className='justify-end relative w-1/3 p-2 text-left border border-gray-400'>{item?.category}</td>
                    <td className='justify-end relative text-left w-1/12 border border-gray-400'>{item?.qty + item.unit}</td>
                    <td className='justify-end relative text-left w-1/3 border border-gray-400'>{item?.rate}</td>
                    <td className='justify-end relative p-2 text-left border border-gray-400 w-1/3'>{item?.total}</td>
                </tr>
            </>
        )
    })
    return (
        <div className='fixed bg-red-800 inset-0 bg-opacity-40 backdrop-blur-sm flex md:justify-center md:items-center overflow-auto'>
            <div className='relative top-20 min-h-[100vh] left-0 w-[60rem] bg-white rounded-xl'>
                <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368" className='absolute right-6 top-4 cursor-pointer' onClick={closeInvoice}>
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
                {print ?
                    (
                        <>
                            <div className='relative top-10 ml-5 mr-5' ref={componentRef} id="invoiceSection">
                                <h1 className='justify-self-center '>{businessName}</h1>
                                <h6 className='justify-self-center '>2A France Road Sabon Gari Kano</h6>
                                <div className='grid grid-cols-6'>
                                    <div className='col-start-1 col-end-3'>
                                        <div>
                                            <h4>{fullName}</h4>
                                            <h6>{auth?.user?.phoneNumber}</h6>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='font-bold'>Invoice #: {invoiceId}</span>
                                            <span className='font-bold'>Date: {today}</span>
                                        </div>
                                    </div>
                                    <div className='col-start-5 col-end-7'>
                                        <h4>{firstName + " " + lastName}</h4>
                                        <h6>{phoneNumber}</h6>
                                    </div>
                                </div>
                                <div className='w-full border-1 border-gray-400 mt-5'></div>
                                <div className='relative -top-5 m-5 w-full overflow-auto'>
                                    <table className='border-1 border-gray-400 justify-self-start'>
                                        <thead className='bg-gray-200'>
                                            <tr className='w-full'>
                                                <th className=''>SN</th>
                                                <th className='w-1/3'>Description</th>
                                                <th className='w-1/4'>Category</th>
                                                <th className='w-1/4'>Qty</th>
                                                <th className='w-1/4'>Rate</th>
                                                <th className='justify-self-center w-1/4'>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {renderInvoice}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button onClick={handlePrint}>Print Now</button>
                            </div>
                        </>
                    ) :
                    (<>
                        <div className='relative top-10 ml-5 mr-5'>
                            <h1 className='justify-self-center '>{businessName}</h1>
                            <h6 className='justify-self-center '>2A France Road Sabon Gari Kano</h6>
                            <div className='grid grid-cols-6'>
                                <div className='col-start-1 col-end-3'>
                                    <div>
                                        <h4>{fullName}</h4>
                                        <h6>{auth?.user?.phoneNumber}</h6>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='font-bold'>Invoice #: {invoiceId}</span>
                                        <span className='font-bold'>Date: {today}</span>
                                    </div>
                                </div>
                                <div className='col-start-5 col-end-7'>
                                    <h4>{firstName + " " + lastName}</h4>
                                    <h6>{phoneNumber}</h6>
                                </div>
                            </div>
                            <div className='w-full border-1 border-gray-400 mt-5'></div>
                            <form onSubmit={submitHandler}>
                                <div className='flex flex-row gap-2'>
                                    <div className='relative basis-2/5'>
                                        <input type='text' placeholder='search for goods' value={itemName} onChange={(e) => setItemName(e.target.value)} className='flex-1 top-7 text-xs h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-full md:h-12 md:p-4 md:pl-8 md:text-lg' />
                                        <div className='absolute w-full flex-1 top-[80px] z-10 basis-2/5 bg-white shadow-md rounded-lg'>
                                            {desc.filter(item => {
                                                const searchItem = itemName?.toLowerCase();
                                                const cat = item?.category?.toLowerCase();
                                                const good = item?.goods?.toLowerCase();
                                                return searchItem && (good?.startsWith(searchItem) || cat?.startsWith(searchItem)) && good !== searchItem
                                            }).map((t) => <div onClick={() => itemNameHandler(t)} className='p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-400 w-[94%] justify-self-center'>{t.description || t.category}</div>)}
                                        </div>
                                    </div>
                                    <div type="text" onClick={amountToggle} className={isToggle ? 'crt basis-1/12' : 'pcs basis-1/12'}>{isToggle ? "crt" : "pcs"}</div>
                                    <input type='number' placeholder='Qty' className='relative basis-1/6 h-10 bg-white shadow-xl hover:shadow rounded-lg flex-1 text-lg pl-2 top-9 ml-2' name='qty' value={invoiceInput.qty} onChange={onChange} />
                                    <input type='number' placeholder='Rate' className='relative basis-1/6 h-10 bg-white shadow-xl hover:shadow rounded-lg flex-1 text-lg pl-2 top-9' name='rate' value={invoiceInput.rate} onChange={onChange} />
                                    <button className='relative h-10 bg-gray-400 text-white font-extrabold top-8 basis-1/12 rounded-lg hover:bg-gray-200 hover:text-black hover:shadow-xl'>OK</button>
                                </div>
                            </form>
                        </div>
                        <div className='relative top-14 m-5 w-full overflow-auto'>
                            <table className='border-1 border-gray-400 justify-self-start'>
                                <thead className='bg-gray-200'>
                                    <tr className='w-full'>
                                        <th className=''>SN</th>
                                        <th className='w-1/3'>Description</th>
                                        <th className='w-1/4'>Category</th>
                                        <th className='w-1/4'>Qty</th>
                                        <th className='w-1/4'>Rate</th>
                                        <th className='justify-self-center w-1/4'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderInvoice}
                                </tbody>
                            </table>
                        </div>
                        <div className='relative w-3/7 top-10 justify-self-end mb-14 mr-5'>
                            <form className='rounded-md shadow-xl hover:shadow md:w-full p-4 content-center'>
                                {/* <input type='number' placeholder='Enter payment' className='h-8 w-full border rounded pl-2 mb-1' name='amt' value={amt} onVolumeChange={(e)=> setAmt()}/> */}
                                <div className='mb-2'>
                                    {["pos", "cash", "transfer"].map((item, index) => (
                                        <div className='mr-2' key={index}>
                                            <label>{item}:
                                                <input
                                                    name={item}
                                                    type='checkbox'
                                                    onChange={paymentHandler}
                                                    checked={paymentMethod.includes(item)}
                                                    className='ml-2'
                                                />
                                            </label>
                                        </div>
                                    ))}
                                    {/* <label className='mr-2'>POS:
                                        <input
                                            name='pos'
                                            type='checkbox'
                                            onChange={paymentHandler}
                                            checked={paymentMethod.includes("pos")}
                                            className='ml-2'
                                        />
                                    </label>
                                    <label className='mr-2'>CASH:
                                        <input
                                            name='cash'
                                            type='checkbox'
                                            onChange={paymentHandler}
                                            checked={paymentMethod.includes("cash")}
                                            className='ml-2'
                                        />
                                    </label>
                                    <label className='mr-2 pr-2 gap-2'>TRANSFER:
                                        <input
                                            name='transfer'
                                            type='checkbox'
                                            onChange={paymentHandler}
                                            checked={paymentMethod.includes("transfer")}
                                            className='ml-2'
                                        />
                                    </label> */}
                                </div>
                                <button className='h-8 bg-gray-400 rounded text-white p-2 font-bold hover:bg-gray-200 hover:text-black' onClick={viewPrintHandler} disabled={invoiceData.length === 0}>ENTER</button>
                            </form>
                        </div>
                    </>
                    )}
            </div>
        </div>
    )
}

export default Invoice
