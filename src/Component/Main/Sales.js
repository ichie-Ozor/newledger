import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Typeahead } from 'react-bootstrap-typeahead';
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useAuth } from '../../Context/auth'
import axios from 'axios'
import { toast } from 'react-toastify';

function Sales() {
  const [ sales, setSales ] = useState([])
  const [sale, setSale] = useState([])
  const [error, setError] = useState("")
  const [category, setCategory] = useState('')
  const auth = useAuth()
  const [ salesInput, setSalesInput ] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

/////////This loads the sales data once the page opens
const salesUrl = "http://localhost:8080/sales"
useEffect(() => {
  try{
    axios.get(salesUrl).then((response) => {
      const data = response.data.sales
      setSales(data)
     })
  }catch(err) {console.log(err.message)}
}, [])



  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setSalesInput({
      ...salesInput, [name] : value
    })
  }

  
  const submitHandler = async (e) => {
    e.preventDefault()
    // console.log("see am here", creditorInput)
    console.log(auth)
    const account_id = auth.user.response.data.userDetail._id
   if(salesInput.date === "" && salesInput.category === "") return 
   setSales((prev) => [
    ...prev,
    {
      id: new Date().getMilliseconds(),
      account: account_id,
      date: salesInput.date,
      description: salesInput.description,
      category: category,
      qty: salesInput.qty,
      rate: salesInput.rate,
      total: salesInput.rate * salesInput.qty
    },
  ])
  setSale((prev) => [
    ...prev, 
    {
      id: new Date().getMilliseconds(),
      account: account_id,
      date: salesInput.date,
      description: salesInput.description,
      category: category,
      qty: salesInput.qty,
      rate: salesInput.rate,
      total: salesInput.rate * salesInput.qty
  }
])
  setSalesInput({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })
}
///////// it should also send data to the backend from here and display it on the page at the same time
const saveHandler = async() => {
  // const lastSaleEntry = sales.slice(-1)
  console.log(category)
 try{
  axios({
        method: 'post',
        url: salesUrl,
        data: sale
      }).then((response) => {
        console.log("sales data posted", response)
        toast.success("Sales Posted Successfully")
        // setError(<div className='relative flex bg-[#087c63] font-bold rounded-[30px] left-[40%] text-2xl text-white opacity-40 w-[350px] h-[50px] items-center justify-center'>Sales Posted Successfully</div>)
      })
 } catch(err) {console.log(err.message)}
 setSale([])
}

//////////////Delete/////////////
const deleteHandler = item => {
   if(item.id !== undefined){  //this is to check if it is stored in the backend or not by checking if it has an _id
  //this is the items displayed at the frontend
  console.log(item.id)
  const id = item.id
   setSales(sales.filter(sale => sale.id !== id))
   setError(<div className='relative flex bg-[#087c63] font-bold rounded-[30px] left-[40%] text-2xl text-white opacity-40 w-[350px] h-[50px] items-center justify-center'>sales successfully deleted</div>)
   }
  //this is the singular item that i want deleted being sent to the backend
  if(item._id){
  const id = item._id
  const deleteItem = sales.filter(sale => sale._id === id)
  setSales(sales.filter(sale => sale._id !== id))
  const salesDeleteUrl = `http://localhost:8080/sales/${id}`
  try{
  axios({
    method: 'delete', 
    url: salesDeleteUrl,
    data: deleteItem
  }).then((response) => {
    setError(<div className='absolute flex bg-[#087c63] font-bold rounded-[30px] left-[40%] text-2xl text-white opacity-40 w-[350px] h-[50px] items-center justify-center'>{response.data.message}</div>)
    // console.log('bring the error here', response)
  })
} catch(err) {console.log(err.message)}
  }
}

/////////////Edit////////////////
const editHandler = id => {
  const editItem = sales.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  
  setSalesInput({
    ...salesInput,
    date: moment(editItem.date).format('DD/MM/YYYY'),
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
        <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
        <td className='bg-gray-200 md:w-72 h-10 rounded pt-2 flex justify-center text-xl'>{description}</td>
        <td className='table-header'>{category}</td>
        <td className='table-header'>{qty}</td>
        <td className='table-header'>{rate}</td>
        <td className='table-header'>{total}</td>
        </tr>
        <button className='btn7a btn7' onClick={() => deleteHandler(value)}>Delete</button>
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
          {/* <input type='text' placeholder='Category' className='btn4' name='category' value={salesInput.category} onChange={onChange}/> */}

          <Typeahead
          className='btn6'
          placeholder='Category'
          onChange={(selected) => {
            setCategory(selected[0]);
          }}
          options={['Animal', 'Cotton', 'Food', 'Tools']}
        />
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
      {error}
      <div>{renderSales}</div>
      <div className='relative float-right right-40 top-40 space-y-8 shadow-xl hover:shadow w-3/5 rounded-xl'>
        <div className='flex space-x-8  mb-6'><div className='btn5'>Total : </div>
          <div className='bg-gray-200 w-72 h-10 rounded pt-2 text-center text-xl'>{salesTotal}</div>
        </div>
      </div>
      <button className='save' onClick={saveHandler}>Save</button>
    </div>
  )
}

export default Sales
