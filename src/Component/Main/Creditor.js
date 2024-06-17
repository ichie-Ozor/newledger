import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import DeleteModal from '../../Utilities/DeleteModal'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useAuth } from '../../Context/auth'
import { toast } from 'react-toastify';

function Creditor() {
   const params = useParams()
   const {accountId}  = params
   const auth = useAuth()
  const {fullName, businessName} = auth.user
    const [client, setClient] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [password, setPassword] = useState({})
    const [error, setError] = useState(null)
    const [deleteId, setDeleteId] = useState()
    const baseUrl = `http://localhost:8080/creditor/${accountId}`    //this is not the right endpoint
    


    // this loads the creditor once the page loads
    useEffect(()=> {
          axios.get(baseUrl).then((response) => {
            console.log(response)
            const creditorsDetail = response.data.creditor
            if(creditorsDetail.length === 0) {
              // toast.error("There is no creditor entered")
              setError(<div className='relative top-60 left-80 text-3xl font-bold'>There is no creditor record here</div>)
            } else{
              setClient(creditorsDetail)
            }
          }).catch(error => {
            console.log(error)
             setError(error)
          })
      }, [])    

     
      const onsubmitDeleteHandler = (e, id) => {
        e.preventDefault()
        //////this is sent to the backend and crossed checkecked if the password match with the profile password before it can delete
        const deleteData = {
          id : deleteId,
          accountId,
          password
        }
        console.log(deleteData)
       
        ////////////////////////////////////send to the backend where the logic is to be done
        if(deleteData.length !== 0){
          console.log("here, delete")
          const deleteUrl = `http://localhost:8080/creditor/${accountId}/${password}/${deleteId}`
          axios.delete(deleteUrl, deleteData).then((response) => 
          console.log(response)
        ).catch(error => {
          console.log(error)
          toast.error("You are not authorized to do this")
        })
        setShowDeleteModal(false)
        } else {
          setShowDeleteModal(false)
        }   
        setPassword({})
      }

      /////////This is to delete client
      const deleteCreditor = (id) => {
        console.log(id)
        setDeleteId(id)
        setShowDeleteModal(true)
      }
    
    ///////This is for the Update button
    const updateCreditor = (id) => {

    }



    const render = client.map((item, id) => {
        return (
        <div key={item.id} className='flex w-screen h-14  m-2 rounded-md shadow-xl hover:shadow flex-wrap justify-center content-center'>
            <div className='flex gap-5'>
                <div>{item.businessName}</div>
                <div>{item.phoneNumber}</div>
                <div>{item.firstName}</div>
            </div>
            <div className='ml-20 float-right'>
                <button className='float-right ml-2 h-10 w-36 bg-red-600 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
                 onClick={() => deleteCreditor(item._id)}>
                   Delete
                 </button>
                 <button className='float-right ml-2 h-10 w-36 bg-gray-500 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
                 onClick={() => updateCreditor(item._id)}>
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
          <Header pageTitle={" Creditor Page"} name={businessName + " " + fullName}/> 
          <div>
          {error ? error : render}
          {/* {render == [] ? <div>There is nothing here</div> : render} */}
          </div>
          <DeleteModal visible={showDeleteModal} close={() => setShowDeleteModal(false)}>
          <form onSubmit={onsubmitDeleteHandler}>  
              <input 
                  type='text' 
                  placeholder='Put in your password here'
                  value={password} 
                  // name='password'
                  onChange={(e) => setPassword(e.target.value)} 
                  className='absolute flex left-20 rounded-sm w-3/4 border-2 p-1 top-14 pl-4'
              />
              <button className='deletebtn'>Enter</button>
          </form>
          </DeleteModal>
        </div>
      )
}

export default Creditor
