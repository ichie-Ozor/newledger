import React, { useState } from 'react'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'


function Debtor() {
  let initialValue 
  const [ debtor, setDebtor ] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [ totalCash, setTotalCash ] = useState(0)
  const [ debtorInput, setDebtorInput ] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setDebtorInput({
    ...debtorInput, [name] : value
  })
}



  const submitHandler = (e) => {
    e.preventDefault()
    // console.log("see am here", creditorInput)
   if(debtorInput.date === "" && debtorInput.category === "") return 
   setDebtor((prev) => [
    ...prev,
    {
      id: new Date().getMilliseconds(),
      date: debtorInput.date,
      description: debtorInput.description,
      category: debtorInput.category,
      qty: debtorInput.qty,
      rate: debtorInput.rate,
      total: debtorInput.rate * debtorInput.qty
    },
  ])

  setDebtorInput({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })
    // it should also send data to the backend from here and display it on the page at the same time
  }


  //////////////Delete/////////////
const deleteHandler = id => {
  console.log(id)
  setDebtor(debtor.filter(debtors => debtors.id !== id))
}

///////////Edit///////////////
const editHandler = id => {
  const editItem = debtor.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  console.log(editItem)
  setDebtorInput({
    ...debtorInput,
    date: editItem.date,
    description: editItem.description,
    category: editItem.category,
    qty: editItem.qty,
    rate: editItem.rate,
  })
  deleteHandler(id)
} 


  ////////Total calculations are here////////////////////////////////
  
  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = debtorTotal - cash
    setTotalCash(total)
  }
   
  ////////////////Total ends here///////////////////////

 const renderDebtor = debtor.map((value, id) => {
  const { total, date, description, category, qty, rate } = value;
  return (
     <tr key={id} className='relative left-60 top-28 mt-2 flex space-x-4'>
      <td className='table-data'>{date}</td>
      <td className='bg-gray-200 w-72 h-10 rounded pt-2 flex justify-center text-xl'>{description}</td>
      <td className='table-data'>{category}</td>
      <td className='table-data'>{qty}</td>
      <td className='table-data'>{rate}</td>
      <td className='table-data'>{total}</td>
      <button className='btn7 left-3' onClick={() => deleteHandler(value.id)}>Delete</button>
      <button className='btn7 left-3' onClick={() => editHandler(value.id)}>Edit</button>
     </tr>
  )
 })

////////////Reducer/////////////
const reducer = (accumulator, currentValue) => {
  const returns = accumulator + Number(currentValue.total)
  console.log(typeof returns);
  return returns
}
const debtorTotal = debtor.reduce(reducer, 0)
console.log(debtorTotal)
  return (
    <div>
      <NavBar />
      <Header name={" Debtor Page"}/>
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn4' name='date' value={debtorInput.date} onChange={onChange}/>
          <input type='text' placeholder='Goods Description' className='btn4' name='description' value={debtorInput.description} onChange={onChange}/>
          <input type='text' placeholder='Category' className='btn4' name='category' value={debtorInput.category} onChange={onChange}/>
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={debtorInput.qty} onChange={onChange}/>
          <input type='number' placeholder='Rate N'className='btn4' name='rate' value={debtorInput.rate} onChange={onChange}/>
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-60 top-28 flex space-x-4'>
        <th className='table-header'>Date</th>
        <th className='bg-gray-200 w-72 h-10 rounded pt-2'>Goods Description</th>
        <th className='table-header'>Category</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      <div>{renderDebtor}</div>
      <div className='relative float-right right-40 top-40 space-y-8 shadow-xl hover:shadow w-3/5 rounded-xl'>
        <div className='flex space-x-8'><div className='btn5'>Total: </div>
          <div className='bg-gray-200 w-72 h-10 rounded pt-2 text-center text-xl'>{debtorTotal}</div>
        </div>
          <div className='flex space-x-8'>
            <div className='btn5'>Paid: </div>
                <input className='bg-gray-100 w-72 h-10 rounded pt-2 flex justify-center text-xl text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment here'/>
                <button className='w-20 h-8 bg-gray-400 ml-2 relative left-32 top-1 rounded-md text-white font-bold text-lg shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
          </div>
        <div className='btn5'>Bal:</div><div className='bg-gray-100 h-10 rounded pt-2 flex justify-center text-xl relative left-32 -top-16 w-72'>{totalCash}</div>
      </div>
    </div>
  )
}

export default Debtor
