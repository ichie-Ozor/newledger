import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import DeleteModal from '../../Utilities/DeleteModal'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { toast } from 'react-toastify'
import { useAuth } from '../../Context/auth'
import UpdateModal from '../../Utilities/UpdateModal'

function Debtor() {
    const [client, setClient] = useState([])
    const { accountId } = useParams()
    const auth = useAuth()
    const {fullName, businessName} = auth.user
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [deleteId, setDeleteId] = useState("")
    const [updateId, setUpdateId] = useState("")
    const [debtorUpdate, setDebtorUpdate ] = useState({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      businessName: "",
      address: ""
    })
    const baseUrl = "http://localhost:8080/debtor"
    

    useEffect(()=> {
          axios.get(baseUrl).then((response) => {
            console.log(response)
            const debtorDetails = response.data.debtors
            if(debtorDetails.length === 0) {
              setError(<div className='relative top-60 left-80 text-3xl font-bold'>There is no creditor record here</div>)
            } else {
              setClient(debtorDetails)
            }
            // setClient(() => response.data.allAccount)
          }).catch(error => {
             setError(error)
          })
      }, [])    

   
      const submitHandler = (e, id) => {
        e.preventDefault()
        // setDeleteId({...deleteId, name: name})  this is supposed to copy the prev content and change only a part of the object
        
        const deleteData = {
          id : deleteId,
          password,
          accountId
        }
        console.log(deleteData)
        /////////////////////////////////////send to the backend where the logic is to be done
        if(deleteData.length !== 0){
        const deleteUrl = `http://localhost:8080/debtor/${accountId}/${password}/${deleteId}`
        axios.delete(deleteUrl, deleteData).then((response) => {
          toast.success(response.data.message)
          window.location.reload()
        })
        .catch(error => {
          console.log(error)
          toast.error("You are not authorized to do this")
        })
        setShowDeleteModal(false)
        } else {
          setShowDeleteModal(false)
        }
        setPassword("")
      }

      ///////////////This is to delete the debtor by only the owner
      const deleteDebtorHandler = (id) => {
        console.log(id)
        setDeleteId(id)
        setShowDeleteModal(true)
      }

      /////////////////////This is for the Update button/////////
      const updateDebtor = (id) => {
        setUpdateId(id)
        setShowUpdateModal(true)
      }

      const onChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setDebtorUpdate({
          ...debtorUpdate, 
          [name] : value,
          createdBy: accountId
        })
      }

      function onSubmitDebtorUpdateHandler(e) {
        e.preventDefault()
        console.log(debtorUpdate)
        try{
          axios.put(baseUrl+`/${updateId}`, debtorUpdate)
          .then((response) => {
           toast.success(response.data.message)
           window.location.reload()
          })
        } catch(error){
          console.error("Error in trying to send updated debtor to the backend", error)
        }

        setShowUpdateModal(false)
        setDebtorUpdate({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          businessName: "",
          address: ""
        })
        setUpdateId("")
      }

    ///////////////////////////////////////////////////////////////

    const render = client.map((item, id) => {
        return (<div key={item.id} className='flex w-screen h-14  m-2 rounded-md shadow-xl hover:shadow flex-wrap justify-center content-center'>
       <div className='flex gap-5'>
           <div>{item.firstName}</div>
           <div>{item.lastName}</div>
           <div>{item.phoneNumber}</div>
       </div>
       <div className='ml-20 float-right'>
           <button className='float-right ml-2 h-10 w-36 bg-red-600 text-white rounded-xl hover:bg-gray-500
            hover:text-black hover:scale-90 duration-300 hover:font-bold' 
            onClick={() => deleteDebtorHandler(item._id)}>
              Delete
            </button>
            <button className='float-right ml-2 h-10 w-36 bg-gray-500 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
                 onClick={() => updateDebtor(item._id)}>
                   Update
                 </button>
            <Link to={`${item._id}`} state={item}><button className='
           float-right h-10 w-36 bg-yellow-400 text-white rounded-xl hover:bg-gray-500
            hover:text-black hover:scale-90 duration-300 hover:font-bold' 
            >Open</button></Link>
       </div>
        </div>)
     })
    return (
        <div>
          <NavBar />
          <Header pageTitle={" Debtor Page"} name={businessName+ " " + fullName}/>
          <div>
          {error ? error :render}
          </div>
          <DeleteModal visible={showDeleteModal} close={() => setShowDeleteModal(false)}>
          <form onSubmit={submitHandler}>  
              <input 
                  placeholder='put in your password here' 
                  type='password' 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className='absolute flex left-20 rounded-[10px] w-3/4 border-2 p-1 top-10 pl-7'
                  />
              <button className='absolute deletebtn w-[14em] top-[6rem] left-[9em] grid justify-items-center justify-self-center'>Enter</button>
          </form>
          </DeleteModal>
          <UpdateModal visible={showUpdateModal} close={() => setShowUpdateModal(false)}>
            <form className='grid justify-center' onSubmit={onSubmitDebtorUpdateHandler}>
              <input className='btn3' type='text' placeholder='Enter First Name' name='firstName' value={debtorUpdate.firstName} onChange={onChange}/>
              <input className='btn3' type='text' placeholder='Enter Last Name' name='lastName' value={debtorUpdate.lastName} onChange={onChange}/>
              <input className='btn3' type='Number' placeholder='Enter Phone Number' name='phoneNumber' value={debtorUpdate.phoneNumber} onChange={onChange}/>
              <input className='btn3' type='text' placeholder='Enter Business Name' name='businessName' value={debtorUpdate.businessName} onChange={onChange}/>
              <input className='btn3' type='text' placeholder='Enter Address' name='address' value={debtorUpdate.address} onChange={onChange}/>
              <button className='w-28 h-11 bg-white relative top-24 left-28 rounded-sm -mt-12 shadow-xl hover:shadow hover:bg-slate-400 hover:text-white hover:font-bold'>Submit</button>
            </form>
          </UpdateModal>
        </div>
      )
}

export default Debtor
