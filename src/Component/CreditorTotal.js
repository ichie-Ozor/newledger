import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { calculateTotalDebt, thousandSeperator } from '../Utilities/helper'
import { baseUrl } from '../Utilities/helper'
import Header from '../Utilities/Header'
import NavBar from '../Utilities/NavBar'
import axios from 'axios'

function CreditorTotal() {
  const params = useParams()
  const { accountId } = params
  const [creditor, setCreditor] = useState([])

  useEffect(() => {
    const fetchCreditor = async () => {
      const baseUrlxx = baseUrl + `/creditorBal/creditorTotal/${accountId}`
      await axios.get(baseUrlxx).then((response) => {
        const v = response.data.creditorBal
        const items = filterArray(v)
        setCreditor(items)
      }).catch(error => {
        console.log(error, "error debit bal total")
      })
    }
    fetchCreditor()
  }, [accountId])


  function filterArray(t) {
    const groupedTransactions = {}
    t.forEach(element => {
      const key = `${element.firstName}_${element.lastName}`;

      if (!groupedTransactions[key]) {
        groupedTransactions[key] = {
          firstName: element.firstName,
          lastName: element.lastName,
          phoneNumber: element.phoneNumber,
          creditorId: element.creditorId,
          purchase: 0,
          paid: 0,
          balance: 0
        };
      }

      groupedTransactions[key].purchase += element.purchase;
      groupedTransactions[key].paid += element.paid;
      groupedTransactions[key].balance += element.balance;
    });
    const conbinedTransactions = Object.values(groupedTransactions);
    return conbinedTransactions
  }

  /////////////////////Reducers////////////////////////////

  const totalCredit = calculateTotalDebt(creditor, 'purchase')
  const totalCreditPaid = calculateTotalDebt(creditor, 'paid')
  const totalCreditBalance = calculateTotalDebt(creditor, 'balance')
  ///////////////////////////////////////////////////////////

  //  console.log(totalCredit,totalCreditPaid,totalCreditBalance, "total debt")
  const renderCreditors = creditor.map((item, index) => (
    <div key={index}>
      <NavLink to={`/dashboard/creditor/${accountId}/${item.creditorId}/transaction`} state={item} className='no-underline text-black font-[600]'>
        <div className='flex space-x-10 hover:bg-blue-700 w-[70vw] p-1 hover:text-white'>
          <div className='text-gray-400 '> {item.firstName}</div>
          <div className='text-gray-400'> {item.lastName}</div>
          <div><span className='text-gray-500'>Phone Number:</span> {thousandSeperator(item.phoneNumber)}</div>
          <div><span className='text-gray-500'>Total Purchase: </span>{thousandSeperator(item.purchase)}</div>
          <div><span className='text-gray-500'>Total Amount Paid: </span>{thousandSeperator(item.paid)}</div>
        </div>
      </NavLink>
    </div>
  ))

  return (
    <div>
      <Header pageTitle={" Total Credit"} />
      <NavBar />
      <div className=' grid justify-items-center mt-3'>
        {renderCreditors}
      </div>
      <div className='grid justify-items-center mt-3'>
        <div>Total Purchase: N{thousandSeperator(totalCredit)}</div>
        <div>Total Credit Paid: N{thousandSeperator(totalCreditPaid)}</div>
        <div>Total Balance: N{thousandSeperator(totalCreditBalance)}</div>
      </div>
    </div>
  )
}


export default CreditorTotal
