import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
// import  Select from 'react-select'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useAuth } from '../../Context/auth'
import { toast } from 'react-toastify';
import axios from 'axios'

function Stock() {
  const location = useLocation()
  const list = location.state
  const [disabled, setDisabled] = useState(false)
  const [stock, setStock] = useState([])
  const [stocks, setStocks] = useState([])
  const auth = useAuth()
  const [error, setError] = useState("")
  // const [category, setCategory] = useState('')
  const [stockInput, setStockInput] = useState({
    date: "",
    goods: "",
    category: "",
    qty: "",
    cost: "",
    sellingPrice: ""
  })

  // console.log(category)
  // const categoryData = [
  //   {name: 'Animal'},
  //   {name: 'Cotton'},
  //   {name: 'Tool'},
  //   {name: 'food'},
  //   {name: 'Drugs'}
  // ]

  /////////This loads the sales data once the page opens
  const account_id = auth.user._id
  const { fullName, businessName } = auth.user
  // console.log(account_id)
  const stockUrl = `http://localhost:8080/stock/${account_id}`
  const stockUrl2 = "http://localhost:8080/stock/"
  // const categoryUrl = "http://localhost:8080/category"
  useEffect(() => {
    try {
      axios.get(stockUrl).then((response) => {
        const data = response.data.Stock
        console.log(response, data)
        setStock(data)
      })
      //  axios.get(categoryUrl).then((response) => {
      //   console.log(response)
      // })
    } catch (err) { console.log(err.message) }
  }, [])

  // useEffect(() => {
  //   try{
  //     //   axios.get(categoryUrl).then((response) => {
  //     //   console.log(response)
  //     // })
  //   }catch(err) {console.log(err.message)}
  // })
  ///////////////////////////////////
  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setStockInput({
      ...stockInput, [name]: value
    })
  }


  const submitHandler = (e) => {
    e.preventDefault()
    // console.log("see am here", creditorInput)
    const account_id = auth.user._id
    console.log(account_id)
    if (
      stockInput.date === "" &&
      stockInput.goods === "" &&
      stockInput.category === "" &&
      stockInput.qty === "" &&
      stockInput.cost === "" &&
      stockInput.sellingPrice === ""
    ) {
      toast.error("Please enter the items")
      return
    }
    setStock((prev) => [
      ...prev,
      {
        id: new Date().getMilliseconds(),
        account: account_id,
        date: stockInput.date,
        goods: stockInput.goods,
        category: stockInput.category,
        qty: stockInput.qty,
        cost: stockInput.cost,
        sellingPrice: stockInput.sellingPrice
      },
    ])

    setStocks((prev) => [
      ...prev,
      {
        id: new Date().getMilliseconds(),
        account: account_id,
        date: stockInput.date,
        goods: stockInput.goods,
        category: stockInput.category,
        qty: stockInput.qty,
        cost: stockInput.cost,
        sellingPrice: stockInput.sellingPrice
      },
    ])

    setStockInput({
      date: "",
      goods: "",
      category: "",
      qty: "",
      cost: "",
      sellingPrice: ""
    })
    // it should also send data to the backend from here and display it on the page at the same time
  }
  console.log(stock)
  //////////////Delete/////////////
  const deleteHandler = item => {
    if (item.id !== undefined) {
      setStock(stock.filter(stocks => stocks.id !== item.id))
    }
    if (item._id) {
      console.log(item._id, "stock")
      const deleteItem = stock.filter(stock => stock._id === item._id)
      setStock(stock.filter(stock => stock._id !== item._id))
      const stockDeleteUrl = `http://localhost:8080/stock/${item._id}`
      try {
        axios({
          method: 'delete',
          url: stockDeleteUrl,
          data: deleteItem
        }).then((response) => {
          console.log(response)
          toast.error(response.message)
        })
      } catch (err) { console.log(err.message) }
    }
  }

  const editHandler = value => {
    console.log(value, "stock id")
    if (value.id !== undefined) {
      const editItem = stock.find(item => item._id === value.id)  //this serches the array to see if the object has the id and returns the object

      setStockInput({
        ...stockInput,
        date: moment(editItem.date).format('DD/MM/YYYY'),
        goods: editItem.goods,
        category: editItem.category,
        qty: editItem.qty,
        cost: editItem.cost,
        sellingPrice: editItem.sellingPrice
      })
      deleteHandler(value)
    } else {
      const editItem = stock.find(item => item._id === value._id)  //this serches the array to see if the object has the id and returns the object

      setStockInput({
        ...stockInput,
        date: moment(editItem.date).format('DD/MM/YYYY'),
        goods: editItem.goods,
        category: editItem.category,
        qty: editItem.qty,
        cost: editItem.cost,
        sellingPrice: editItem.sellingPrice
      })
      deleteHandler(value)
    }
  }

  ///////// it should also send data to the backend from here and display it on the page at the same time
  const saveHandler = async () => {
    try {
      axios({
        method: 'post',
        url: stockUrl2,
        data: stocks
      }).then((response) => {
        console.log("stock data posted", response)
        toast.success("Stocks Posted Successfully")
        // setError(<div className='relative flex bg-[#087c63] font-bold rounded-[30px] left-[40%] text-2xl text-white opacity-40 w-[350px] h-[50px] items-center justify-center'>Sales Posted Successfully</div>)
      })
    } catch (err) { console.log(err.message) }
    setStocks([])
  }


  const renderStock = stock.map((value, id) => {
    const { sellingPrice, date, goods, category, qty, cost } = value;
    return (
      <>
        <div key={id} className='relative flex space-x-2 left-2 w-78 top-28 md:left-60 md:mt-2 md:space-x-4'>
          <div className='table-header'>{moment(date).format('DD/MM/YYYY')}</div>
          <div className='table-header'>{category}</div>
          <div className='bg-gray-200 md:w-60 text-center h-10 justify-center rounded pt-2 text-xs md:text-lg pl-4'>{goods}</div>
          <div className='table-header'>{qty}</div>
          <div className='table-header'>{cost}</div>
          <div className='table-header'>{sellingPrice}</div>
        </div>
        <button className='btn7  relative top-20 left-[102%] md:left-[86.5%]' onClick={() => deleteHandler(value)}>Delete</button>
        <button className='btn7  relative top-20 w-40 left-[102%] md:left-[86.5%]' onClick={() => editHandler(value)}>Edit</button>
      </>
    )
  })
  return (
    <div>
      <NavBar />
      <Header pageTitle={" Stocks Page"} name={businessName + " " + fullName} />
      <div className='absolute left top-22  container'>
        <form className='relative flex  left-2' onSubmit={submitHandler}>
          <input type='date' placeholder='date' className='btn6' name='date' value={stockInput.date} onChange={onChange} />
          <input type='text' placeholder='Category' className='btn6' name='category' value={stockInput.category} onChange={onChange} />
          <input type='text' placeholder='Available Goods' className='btn6' name='goods' value={stockInput.goods} onChange={onChange} />

          <input type='number' placeholder='Qty' className='btn6' name='qty' value={stockInput.qty} onChange={onChange} />
          <input type='number' placeholder='Cost Price N' className='btn6' name='cost' value={stockInput.cost} onChange={onChange} />
          <input type='number' placeholder='Selling Price N' className='btn6' name='sellingPrice' value={stockInput.sellingPrice} onChange={onChange} />
          <button type='submit' className='submit' >Submit</button>
        </form>
      </div>
      <div className='relative left-2 top-24 flex space-x-2 md:left-60 md:top-28 md:flex md:space-x-4'>
        <div className='table-header'>Date</div>
        <div className='table-header'>Category</div>
        <div className='bg-gray-200 md:w-60 text-center h-10 rounded pt-2 text-xs md:text-lg'>Available Goods</div>
        <div className='table-header'>Quantity</div>
        <div className='table-header'>Cost Price</div>
        <div className='table-header'>Selling Price</div>
      </div>
      {error}
      <div>{renderStock}</div>
      <button className={stocks.length === 0 ? 'unsave' : 'save'} onClick={saveHandler} disabled={stocks.length === 0}>Save</button>
    </div>
  )
}

export default Stock
