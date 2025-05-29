import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../Utilities/Header'
import SideBar from '../../Utilities/SideBar'
import moment from 'moment';
import axios from 'axios';
import { baseUrl, thousandSeperator } from '../../Utilities/helper'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function DebtorTransaction() {
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState()
  const [paid, setPaid] = useState([])
  // const [bal, setBal] = useState([])
  const params = useParams()
  const { debtorId } = params


  const location = useLocation()
  if (location.state === null) { console.log("NOthing is coming from the eachCreditor component") }
  const debtorDetails = location.state
  const { firstName, lastName, phoneNumber } = debtorDetails


  const DebtorUrl = baseUrl + `/debtorBal/${debtorId}`
  const DebtorUrl2 = baseUrl + `/debt/${debtorId}`

  const getList = useCallback(() => {
    axios.get(DebtorUrl2).then((response) => {
      const transactionDetail = response.data.debts
      setTransaction(transactionDetail)
    }).catch(error => {
      console.log(error)
    })

    axios.get(DebtorUrl)
      .then((response) => {
        setPaid(response.data.debtorBal)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try again later!")
      })

  }, [DebtorUrl, DebtorUrl2])

  useEffect(() => {
    getList()
  }, [getList])

  const renderDebtTransaction = paid?.map((item, id) => {
    return (
      <div key={id} className='table'>
        <tr>
          <td>{moment(item.createdAt).format('DD/MM/YYYY')}</td>
          <td>{thousandSeperator(item.paid)}</td>
        </tr>
      </div>
    )
  })
  const renderTransaction = transaction?.map((item, id) => {
    return (
      <div key={id} className='table'>
        <tr>
          <td>{moment(item.date).format('DD/MM/YYYY')}</td>
          <td>{thousandSeperator(item.total)}</td>
        </tr>
      </div>
    )
  })

  const totalPurchase = transaction?.map(val => val.total).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const totalPaid = paid?.map(val => val.paid).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  return (
    <div>
      {/* <SideBar classStyle='fixed grid w-[100%] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center' /> */}
      {/* <Header pageTitle={` to ${firstName} ${lastName} Creditor Page`} name={firstName + " " + lastName} classStyle='bg-primary-200 h-36 w-[153vw] md:w-[100vw] flex' /> */}
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
                <th>Debt</th>
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
              {renderDebtTransaction}
            </div>
          </table>
          <div className='flex justify-center mt-5 space-x-8'>
            <div className='text-xl font-bold'></div>
            <div className='text-xl font-[600]'>Total debt: {thousandSeperator(totalPurchase)}</div>
            <div className='text-xl font-[600]'>Cash Paid: {thousandSeperator(totalPaid)}</div>
            <div className='text-xl font-[600] ml-2'>Balance: {thousandSeperator(totalPurchase - totalPaid)}</div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DebtorTransaction
