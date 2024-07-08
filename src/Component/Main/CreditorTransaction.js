import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../Utilities/Header'
import NavBar from '../../Utilities/NavBar'
import moment from 'moment';
import axios from 'axios';
import { useLocation, useParams, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify';                   

function CreditorTransaction() {
    const navigate = useNavigate()
    const [transaction, setTransaction] = useState()
    const [paid, setPaid] = useState([])
    // const [bal, setBal] = useState([])
    const params = useParams()
    const { creditorId } = params
    

    const location = useLocation()
    if(location.state === null){console.log("NOthing is coming from the eachCreditor component")}
    const creditorDetails = location.state
    const {firstName, lastName, phoneNumber, _id } = creditorDetails
    const y = Number(_id)
    // console.log(location.state, typeof _id, typeof creditorId, typeof y, creditorDetails)


    const CreditorUrl = `http://localhost:8080/creditorBal/${creditorId}`
    const CreditorUrl2 = `http://localhost:8080/credit/${creditorId}`

    const getList = useCallback(() => {
      console.log(creditorId, params);
         axios.get(CreditorUrl2).then((response) => {
              const transactionDetail = response.data.credits
              setTransaction(transactionDetail)
          }).catch(error => {
            console.log(error)
          })

          axios.get(CreditorUrl)
          .then((response) => {
            console.log(response.data.creditBal, "credit here")
             setPaid(response.data.creditBal)
          })
      
  }, [CreditorUrl,creditorId, params])

  useEffect(()=>{
    getList()
  },[getList])

  //  console.log( transaction)
   const renderCreditTransaction = paid?.map((item, id) => {
    // console.log(item)
    return (
        <div key={id} className='table'>
          <tr>
            <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
            <td>{item.paid}</td>
          </tr>
        </div>
      )
   })
   const renderTransaction = transaction?.map((item, id) => {
    return(
      <div key={id} className='table'>
           <tr>
                <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                <td>{item.total}</td>
              </tr>
         </div>
    )
   })

   const totalPurchase = transaction?.map(val=> val.total).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const totalPaid = paid?.map(val=> console.log(val.paid)).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  console.log(transaction,typeof totalPaid, "transaction")
  return (
    <div>
      <Header />
      <NavBar>
        <div onClick={() => navigate(-1)}  className='nav text-xs font-bold ml-3 mt-3 cursor-pointer'>BACK</div>
      </NavBar>
      <div>
      <div className='flex align-items-center justify-center mb-3'>
        <div className='relative top-12 font-bold text-3xl text-gray-600'>Transaction detail of {firstName + " " + lastName}</div>
        <span className='relative top-12 font-bold text-3xl text-gray-600 ml-5'>{phoneNumber}</span>
      </div>
      <div className=''>
      <table className='flex justify-center mt-5'>
            <div className='w-[30%]'>
              <tr>
                <th>Date</th>
                {/* <th>Purchase</th> */}
                <th>Credit</th>
                {/* <th>Balance</th> */}
              </tr>
              {renderTransaction}
            </div>
            <div className='w-[30%] ml-10'>
              <tr>
                <th>Date</th>
                {/* <th>Purchase</th> */}
                <th>Cash Paid</th>
                {/* <th>Balance</th> */}
              </tr>
              {renderCreditTransaction}
            </div>
      </table>
      <table className=''>
        <tr className='flex justify-center ml-24'>
          <th>credit</th>
          <th>cash Paid</th>
          <th className='ml-6'>Balance</th>
        </tr>
        <tr className='flex justify-center mb-2'>
          <td className='text-xl font-bold'>Total</td>
          <td  className='text-xl font-bold'>{totalPurchase}</td>
          <td className='text-xl font-bold'>{totalPaid}</td>
          <td className='text-xl font-bold ml-2'>{totalPurchase - totalPaid}</td>
        </tr> 
      </table>
      </div>
      </div>
    </div>
  )
}

export default CreditorTransaction
