import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import DeleteModal from '../../Utilities/DeleteModal'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useAuth } from '../../Context/auth'
import { toast } from 'react-toastify';
import UpdateModal from '../../Utilities/UpdateModal'

function Creditor() {
   const params = useParams()
   const {accountId}  = params
   const auth = useAuth()
  const {fullName, businessName} = auth.user
    const [client, setClient] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [updateId, setUpdateId] = useState('')
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const [deleteId, setDeleteId] = useState()
    // const [deleteItem, setDeleteItem] = useState(false)
    const [creditorUpdate, setCreditorUpdate] = useState({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      businessName: "",
      address: ""
    })
    const baseUrl = "http://localhost:8080"    //this is not the right endpoint
    


    // this loads the creditor once the page loads
    useEffect(()=> {
          axios.get(baseUrl+ `/creditor/${accountId}`).then((response) => {
            const creditorsDetail = response.data.creditor
            if(creditorsDetail.length === 0) {
              setError(<div className='relative top-60 left-80 text-3xl font-bold'>There is no creditor record here</div>)
            } else{
              setClient(creditorsDetail)
            }
          }).catch(error => {
            console.log(error)
             setError(error)
          })
      }, [])    

     ////////////Delete modal

      const deleteCreditor = (id) => {
        console.log(id)
        setDeleteId(id)
        setShowDeleteModal(true)
      }

      const onsubmitDeleteHandler = (e, id) => {
        e.preventDefault()
        const profileUrl = baseUrl+`/profile/${accountId}`;
        const deleteData = {
          id : deleteId,
          accountId,
          password
        };
        //////this is sent to the backend and crossed checkecked if the password match with the profile password before it can delete
        axios({
          method: 'get', 
          url: profileUrl+ `/${deleteData.password}`,
         }).then((response) => {
          console.log(response.data.status)
          if(response.data.status === "Success"){
            // setDeleteItem(true)
            const deleteUrl = `http://localhost:8080/creditor/${accountId}/${password}/${deleteId}`
            axios.delete(deleteUrl, deleteData).then((response) =>{ 
              window.location.reload()
              toast.success(response.data.message)}
          )  
          } else {
            // setDeleteItem(false)
            toast.error("You are not authorized to do this")
          }
         }).catch(error => {
          console.error('Error occured while trying to get profile', error)
         })
         setShowDeleteModal(false)
         setPassword("")
      }

    /////////////////////////////////////This is for the Update button
    const updateCreditor = (id) => {
      setUpdateId(id)
      setShowUpdateModal(true)
    }

    function onChange(e){
      e.preventDefault()
      const {name, value} = e.target
      setCreditorUpdate({
        ...creditorUpdate,
        [name] : value,
        createdBy: accountId
      })
    }
    const onSubmitCreditorUpdateHandler = (e) => {
      e.preventDefault()
        try{
          axios.put(baseUrl+`/creditor/${updateId}`, creditorUpdate)
          .then((response) => {
            toast.success(response.data.message)
            window.location.reload()
          })
        } catch(error){
          console.error("Error in trying to send updated debtor to the backend", error)
        }

        setShowUpdateModal(false)
        setCreditorUpdate({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          businessName: "",
          address: ""
        })
        setUpdateId("")
    }


    const render = client.map((item, id) => {
        return (
        <div key={item.id} className='flex w-screen h-14  mt-4 md:mt-0 m-2 rounded-md shadow-xl hover:shadow flex-wrap justify-center content-center'>
            <div className='flex gap-1 md:gap-5 space-x-2'>
                <div>{item.businessName}</div>
                <div>{item.phoneNumber}</div>
                <div>{item.firstName}</div>
                <div>{item.lastName}</div>
            </div>
            <div className='ml-20 float-right'>
                <button className='float-right ml-2 md:h-10 w-14 md:w-36 bg-red-600 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
                 onClick={() => deleteCreditor(item._id)}>
                   Delete
                 </button>
                 <button className='float-right ml-2 md:h-10  w-14 md:w-36 bg-gray-500 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
                 onClick={() => updateCreditor(item._id)}>
                   Update
                 </button>
                 <Link to={`${item._id}`} state={item}><button className='
                float-right md:h-10  w-14 md:w-36 bg-yellow-400 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
               >Open</button></Link>
            </div>
        </div>)
     })



    return (
        <div>
          <NavBar /> 
          <Header pageTitle={" Creditor Page"} name={businessName + " " + fullName}/> 
          <div>
          {error ? error : render}
          </div>
          <DeleteModal visible={showDeleteModal} close={() => setShowDeleteModal(false)}>
          <form onSubmit={onsubmitDeleteHandler}>  
              <input 
                  type='password' 
                  placeholder='Put in your password here'
                  value={password} 
                  name='password'
                  onChange={(e) => setPassword(e.target.value)} 
                  className='absolute flex left-10 md:left-20 rounded-[10px] w-64 md:w-3/4 border-2 p-1 top-10 pl-7'
              />
              <button className='absolute deletebtn w-[7em] md:w-[14em] top-[6rem] left-[6em] md:left-[9em] grid justify-items-center justify-self-center'>Enter</button>
          </form>
          </DeleteModal>
          <UpdateModal visible={showUpdateModal} close={() => setShowUpdateModal(false)}>
            <form className='grid justify-center' onSubmit={onSubmitCreditorUpdateHandler}>
              <input className='btn3' type='text' placeholder='Enter First Name' name='firstName' value={creditorUpdate.firstName} onChange={onChange}/>
              <input className='btn3' type='text' placeholder='Enter Last Name' name='lastName' value={creditorUpdate.lastName} onChange={onChange}/>
              <input className='btn3' type='Number' placeholder='Enter Phone Number' name='phoneNumber' value={creditorUpdate.phoneNumber} onChange={onChange}/>
              <input className='btn3' type='text' placeholder='Enter Business Name' name='businessName' value={creditorUpdate.businessName} onChange={onChange}/>
              <input className='btn3' type='text' placeholder='Enter Address' name='address' value={creditorUpdate.address} onChange={onChange}/>
              <button className='w-28 h-11 bg-white relative top-24 left-28 rounded-sm -mt-12 shadow-xl hover:shadow hover:bg-slate-400 hover:text-white hover:font-bold'>Submit</button>
            </form>
          </UpdateModal>
        </div>
      )
}

export default Creditor
