import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { calculateTotalDebt, thousandSeperator } from '../Utilities/helper'
import Header from '../Utilities/Header'
import NavBar from '../Utilities/NavBar'
import axios from 'axios'

function DebtorTotal() {
  const params = useParams()
  const { accountId } = params
  const [debtor, setDebtor] = useState([])

  useEffect(() => {
    const fetchDebtor = async () => {
      const baseUrl = `http://localhost:8080/debtorBal/debtorTotal/${accountId}`
      await axios.get(baseUrl).then((response) => {
        console.log(response.data.debtorBal)
        const v = response.data.debtorBal
        const items = filterArray(v)
        setDebtor(items)
      }).catch(error => {
        console.log(error, "error debit bal total")
      })
    }
    fetchDebtor()
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
          debtorId: element.debtorId,
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

  console.log(debtor)
  /////////////////////Reducers////////////////////////////

  const totalDebt = calculateTotalDebt(debtor, 'purchase')
  const totalDebtPaid = calculateTotalDebt(debtor, 'paid')
  const totalDebtBalance = calculateTotalDebt(debtor, 'balance')
  ///////////////////////////////////////////////////////////

  const renderDebtors = debtor.map((item, index) => (
    <div key={index}>
      <NavLink to={`/dashboard/debtor/${accountId}/${item.debtorId}/transaction`} state={item} className='no-underline text-black font-[600]'>
        <div className='flex space-x-10 hover:bg-blue-700 w-[70vw] p-1 hover:text-white'>
          <div className='text-gray-400'>{item.firstName}</div>
          <div className='text-gray-400'>{item.lastName}</div>
          <div><span className='text-gray-500'>Phone Number:</span> {thousandSeperator(item.phoneNumber)}</div>
          <div><span className='text-gray-500'>Total Purchase: </span>{thousandSeperator(item.purchase)}</div>
          <div><span className='text-gray-500'>Total Amount Paid: </span>{thousandSeperator(item.paid)}</div>
        </div>
      </NavLink>
    </div>
  ))

  return (
    <div>
      <Header pageTitle={" Total Debt"} />
      <NavBar />
      <div className=' grid justify-items-center mt-3'>
        {renderDebtors}
      </div>
      <div className='grid justify-items-center mt-3'>
        <div>Total Purchase: N{thousandSeperator(totalDebt)}</div>
        <div>Total Debt Paid: N{thousandSeperator(totalDebtPaid)}</div>
        <div>Total Balance: N{thousandSeperator(totalDebtBalance)}</div>
      </div>
    </div>
  )
}

export default DebtorTotal
