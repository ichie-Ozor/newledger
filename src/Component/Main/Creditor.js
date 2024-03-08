import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import DeleteModal from '../../Utilities/DeleteModal'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { toast } from 'react-toastify';

function Creditor() {
    const [client, setClient] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [name, setName] = useState("")
    const [error, setError] = useState(null)
    const [deleteId, setDeleteId] = useState({id: ""})
    const baseUrl = "http://localhost:8080/creditor/"    //this is not the right endpoint
    const deleteUrl = "http://localhost:8080/creditor/:id"


    // this loads the creditor once the page loads
    useEffect(()=> {
          axios.get(baseUrl).then((response) => {
            console.log(response.data.creditors)
            const creditorsDetail = response.data.creditors
            if(creditorsDetail == []) {
              toast.error("There is no creditor entered")
            } else{
              setClient(creditorsDetail)
            }
             //setClient(creditorsDetail)   // this one works
            // creditorsDetail == [] ? setError(error.credMesg) : setClient(creditorsDetail)
            // setClient(() => response.data.allAccount)
          }).catch(error => {
             setError(error)
          })
      }, [])    

     
      const onsubmitDeleteHandler = (e, id) => {
        e.preventDefault()
        // setDeleteId({...deleteId, name: name})  this is supposed to copy the prev content and change only a part of the object
        setName("")
        const deleteData = {
          id : deleteId.id,
          name : name
        }
        console.log(deleteData)
       
        ////////////////////////////////////send to the backend where the logic is to be done
        if(!deleteData){
          axios.delete(deleteUrl, deleteData).then((response) => 
          console.log(response))
          .catch(error => {
          setError(error)
        })
        setShowDeleteModal(false)
        } else {
          setShowDeleteModal(false)
        }
                
      }

      /////////This is to delete client
      const deleteCreditor = (id) => {
        console.log(id)
        setDeleteId({id: id})
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
                 <Link to='eachcreditor' state={item}><button className='
                float-right h-10 w-36 bg-yellow-400 text-white rounded-xl hover:bg-gray-500
                 hover:text-black hover:scale-90 duration-300 hover:font-bold' 
               >Open</button></Link>
            </div>
        </div>)
     })



    return (
        <div>
          <NavBar /> 
          <Header name={" Creditor Page"}/> 
          <div>
          {error ? error.message : render}
          {/* {render == [] ? <div>There is nothing here</div> : render} */}
          </div>
          <DeleteModal visible={showDeleteModal} close={() => setShowDeleteModal(false)}>
          <form onSubmit={onsubmitDeleteHandler}>  
              <input placeholder='put in your password here' type='password' value={name} onChange={(e) => setName(e.target.value)} className='absolute flex left-20 rounded-sm w-3/4 border-2 p-1 top-14 pl-4'/>
              <button className='deletebtn'>Enter</button>
          </form>
          </DeleteModal>
        </div>
      )
}

export default Creditor
