import React, { useState } from 'react'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'

function Stock() {

  const [ stock, setStock ] = useState([])
  const [ stockInput, setStockInput ] = useState({
    date: "",
    availGoods: "",
    category: "",
    qty: "",
    cPrice: "",
    sPrice: ""
  })

  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setStockInput({
      ...stockInput, [name] : value
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    // console.log("see am here", creditorInput)
   if(stockInput.date === "" && stockInput.category === "") return 
   setStock((prev) => [
    ...prev,
    {
      id: new Date().getMilliseconds(),
      date: stockInput.date,
      availGoods: stockInput.availGoods,
      category: stockInput.category,
      qty: stockInput.qty,
      cPrice: stockInput.cPrice,
      sPrice: stockInput.sPrice 
    },
  ])

  setStockInput({
    date: "",
    availGoods: "",
    category: "",
    qty: "",
    cPrice: "",
    sPrice: ""
  })
    // it should also send data to the backend from here and display it on the page at the same time
  }
  console.log(stock)
//////////////Delete/////////////
const deleteHandler = id => {
  console.log(id)
  setStock(stock.filter(stocks => stocks.id !== id))
}


const editHandler = id => {
  const editItem = stock.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  
  setStockInput({
    ...stockInput,
    date: editItem.date,
    availGoods: editItem.availGoods,
    category: editItem.category,
    qty: editItem.qty,
    cPrice: editItem.cPrice,
    sPrice: editItem.sPrice
  })
  deleteHandler(id)
} 

   
    const renderStock = stock.map((value, id) => {
      const { sPrice, date, availGoods, category, qty, cPrice } = value;
      return (
         <tr key={id} className='flex left-22 bg-red-600 w-78 top-28 relative md:left-56 md:mt-2 md:space-x-4'>
          <td className='table-data'>{date}</td>
          <td className='w-60 bg-gray-200  h-10 rounded pt-2 flex justify-center md:text-xl md:w-72'>{availGoods}</td>
          <td className='table-data'>{category}</td>
          <td className='table-data'>{qty}</td>
          <td className='table-data'>{cPrice}</td>
          <td className='table-data'>{sPrice}</td>
          <button className='btn7 left-16 md:-left-1' onClick={() => deleteHandler(value.id)}>Delete</button>
          <button className='btn7 left-16 md:-left-1' onClick={() => editHandler(value.id)}>Edit</button>
         </tr>
      )
     })
  return (
    <div>
      <NavBar />
      <Header name={" Stocks Page"}/>
      <div className='absolute left top-22  container'>
        <form className='relative flex  left-2' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn6' name='date' value={stockInput.date} onChange={onChange}/>
          <input type='text' placeholder='Available Goods' className='btn6' name='availGoods' value={stockInput.availGoods} onChange={onChange}/>
          <input type='text' placeholder='Category' className='btn6' name='category' value={stockInput.category} onChange={onChange}/>
          <input type='number' placeholder='Qty' className='btn6' name='qty' value={stockInput.qty} onChange={onChange}/>
          <input type='number' placeholder='Cost Price N'className='btn6' name='cPrice' value={stockInput.cPrice} onChange={onChange}/>
          <input type='number' placeholder='Selling Price N'className='btn6' name='sPrice' value={stockInput.sPrice} onChange={onChange}/>
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-42 top-24 flex space-x-2 md:left-56 md:top-28 md:flex md:space-x-4'>
        <th className='table-header'>Date</th>
        <th className='bg-gray-200 w-72 h-10 rounded pt-2 text-sm md:text-lg'>Available Goods</th>
        <th className='table-header'>Category</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Cost Price</th>
        <th className='table-header'>Selling Price</th>
      </table>
      <div>{renderStock}</div>
    </div>
  )
}

export default Stock
