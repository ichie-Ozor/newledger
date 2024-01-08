import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Creditor() {
    const [client, setClient] = useState([])
    // const [renew, setRenew] = useState([])
    const [error, setError] = useState(null)
    const baseUrl = "http://localhost:8080/auth/getaccount"

    useEffect(()=> {
          axios.get(baseUrl).then((response) => {
            setClient(() => response.data.allAccount)
          }).catch(error => {
             setError(error)
          })
      }, [])    

      //Not working so discard
      // const renewTimerHandler = (id) => {
      //     console.log(id)
      //     setRenew(client.filter((example) => (example._id === id)))  //this one picks the individual client that was clicked
      //      return id
      //   }


      const deleteTimerHandler = (id) => {}

    const render = client.map((item, id) => {
        return (<div key={item.id} className='flex w-screen h-14  m-2 rounded-md shadow-xl hover:shadow flex-wrap justify-center content-center'>
       <div className='flex gap-5'>
           <div>{item.businessName}</div>
           <div>{item.email}</div>
           <div>{item.fullName}</div>
       </div>
       <div className='ml-20 float-right'>
           <button className='float-right ml-2 h-10 w-36 bg-red-600 text-white rounded-xl hover:bg-gray-500
            hover:text-black hover:scale-90 duration-300 hover:font-bold' 
            onClick={() => deleteTimerHandler(item.id)}>
              Delete
            </button>
            <Link to='eachcreditor' state={item}><button className='
           float-right h-10 w-36 bg-yellow-400 text-white rounded-xl hover:bg-gray-500
            hover:text-black hover:scale-90 duration-300 hover:font-bold' 
            >Renew</button></Link>
       </div>
        </div>)
     })
    return (
        <div>
          <div className='h-24 bg-gray-100 text-black text-5xl rounded-md shadow-xl hover:shadow content-center flex flex-wrap justify-center'>
            This is Admin Dashboard
          </div>
          <div>
          {error ? error.message :render}
          </div>
        </div>
      )
}

export default Creditor
