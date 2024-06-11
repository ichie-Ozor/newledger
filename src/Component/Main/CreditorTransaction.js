import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../Utilities/Header'
import NavBar from '../../Utilities/NavBar'
import moment from 'moment';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';                   

function CreditorTransaction() {
    const [transaction, setTransaction] = useState()
    const [paid, setPaid] = useState([])
    const [bal, setBal] = useState([])
    const params = useParams()
    const { creditorId } = params
    

    const location = useLocation()
    if(location.state === null){console.log("NOthing is coming from the eachCreditor component")}
    const creditorDetails = location.state
    const {firstName, lastName, phoneNumber, _id } = creditorDetails
    const y = Number(_id)
    console.log(location.state, typeof _id, typeof creditorId, typeof y, creditorDetails)


    const CreditorUrl = `http://localhost:8080/creditorBal/${creditorId}`

    const getList = useCallback(() => {
      console.log(creditorId, params);
      try{
         axios.get(CreditorUrl).then((response) => {
            console.log(response, "see me")
              const transactionDetail = response.data.creditBal
              setTransaction(transactionDetail)
          })

        // fetch(CreditorUrl)
        // .then((res) => res.json())
        // .then((response) => {
        //   console.log(response)
        //   // if(response.creditBal.lenght === 0) {
        //   //   // return toast.error(`Nothing has being entered for ${firstName} ${lastName}`)
        //   // }
        //   setTransaction(response.creditBal)
        // })
      } catch(err){console.log(err.message)}
  }, [CreditorUrl,creditorId])

  useEffect(()=>{
    getList()
  },[getList])

   
    


   console.log( transaction)


   const renderTransaction = transaction?.map((item, id) => {
    console.log(item.paid)
    paid.push(item.paid)
    //  paids = item.paid
    // setPaid([item.paid])
    return(
        <div key={id} className='table'>
              <tr>
                <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
                <td>{item.purchase}</td>
                <td>{item.paid}</td>
                <td>{item.balance}</td>
              </tr>
        </div>
    )
   })
   console.log(paid)
   const totalPurchase = transaction?.map(val=>val.purchase).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const totalPaid = transaction?.map(val=>val.paid).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  //  const reducer = (accumulator, currentValue) => {
  //   const returns = accumulator + Number(currentValue)
  //   return returns
  //  }
  //  const totalTransaction = transaction.map((item, id) => {
  //    const amountPaid = item.paid
  //    console.log(amountPaid)
  //    const paid = amountPaid.reduce(reducer, 0)
  //   return (
  //     <div key={id}>
         
  //     </div>
  //   )
  //  })
  // const totalTransaction = transaction.reduce((accumulator, currentValue) => {
  //   console.log(accumulator, currentValue)
  // }, 0)

  return (
    <div>
      <Header />
      <NavBar pageTitle={firstName} name={lastName}/>
      <div className='relative left-80 top-12 font-bold text-3xl text-gray-600'>Transaction detail of {firstName + " " + lastName}</div>
      <span>{phoneNumber}</span>
      <div >
      <table className='relative left-60 top-12'>
              <tr>
                <th>Date</th>
                <th>Purchase</th>
                <th>Amount Paid</th>
                <th>Balance</th>
              </tr>
        {renderTransaction}
            <tr>
              <td>Total</td>
              <td>{totalPurchase}</td>
              <td>{totalPaid}</td>
              <td>{totalPurchase - totalPaid}</td>
             </tr> 
      </table>
      </div>
    </div>
  )
}

export default CreditorTransaction
