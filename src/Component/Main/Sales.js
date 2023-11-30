import React, { useState } from 'react'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'

function Sales() {
  const [ sales, setSales ] = useState([])
  const [ salesInput, setSalesInput ] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setSalesInput({
      ...salesInput, [name] : value
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    // console.log("see am here", creditorInput)
   if(salesInput.date === "" && salesInput.category === "") return 
   setSales((prev) => [
    ...prev,
    {
      id: new Date().getMilliseconds(),
      date: salesInput.date,
      description: salesInput.description,
      category: salesInput.category,
      qty: salesInput.qty,
      rate: salesInput.rate,
      total: salesInput.rate * salesInput.qty
    },
  ])

  setSalesInput({
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
  setSales(sales.filter(sale => sale.id !== id))
  console.log(sales)
}

/////////////Edit////////////////
const editHandler = id => {
  const editItem = sales.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  
  setSalesInput({
    ...salesInput,
    date: editItem.date,
    availGoods: editItem.availGoods,
    category: editItem.category,
    qty: editItem.qty,
    cPrice: editItem.cPrice,
    sPrice: editItem.sPrice
  })
  deleteHandler(id)
} 



////////////Reducer/////////////
  const reducer = (accumulator, currentValue) => {
  const returns = accumulator + Number(currentValue.total)
  return returns
}
const salesTotal = sales.reduce(reducer, 0)


  const renderSales = sales.map((value, id) => {
    const { total, date, description, category, qty, rate } = value;
    return (
      <>
       <tr key={id} className='relative top-20 left-2 md:left-60 md:top-28 mt-2 flex space-x-4'>
        <td className='table-header'>{date}</td>
        <td className='bg-gray-200 md:w-72 h-10 rounded pt-2 flex justify-center text-xl'>{description}</td>
        <td className='table-header'>{category}</td>
        <td className='table-header'>{qty}</td>
        <td className='table-header'>{rate}</td>
        <td className='table-header'>{total}</td>
        </tr>
        <button className='btn7a btn7' onClick={() => deleteHandler(value.id)}>Delete</button>
        <button className='btn7a btn7' onClick={() => editHandler(value.id)}>Edit</button>
      </> 
    )
   })

  return (
    <div>
      <NavBar />
      <Header name={" Sales Page"}/>
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn4' name='date' value={salesInput.date} onChange={onChange}/>
          <input type='text' placeholder='Sales Description' className='btn4' name='description' value={salesInput.description} onChange={onChange}/>
          <input type='text' placeholder='Category' className='btn4' name='category' value={salesInput.category} onChange={onChange}/>
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={salesInput.qty} onChange={onChange}/>
          <input type='number' placeholder='Rate N'className='btn4' name='rate' value={salesInput.rate} onChange={onChange}/>
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-2 top-20 space-x-2 md:left-60 md:top-28 flex md:space-x-4'>
        <th className='table-header'>Date</th>
        <th className='text-xs bg-gray-200 md:w-72 h-10 rounded pt-2 md:text-lg'>Sales Description</th>
        <th className='table-header'>Category</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      <div>{renderSales}</div>
      <div className='relative float-right right-40 top-40 space-y-8 shadow-xl hover:shadow w-3/5 rounded-xl'>
        <div className='flex space-x-8  mb-6'><div className='btn5'>Total : </div>
          <div className='bg-gray-200 w-72 h-10 rounded pt-2 text-center text-xl'>{salesTotal}</div>
        </div>
      </div>
    </div>
  )
}

export default Sales
