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
import { baseUrl } from '../../Utilities/helper';

function Stock() {
  const location = useLocation()
  const list = location.state
  const [open, setOpen] = useState(false)
  const [stock, setStock] = useState([])
  const [stocks, setStocks] = useState([])
  const auth = useAuth()
  const [error, setError] = useState("")
  const [filterInput, setFilterInput] = useState({
    from: "",
    to: ""
  })
  const [nameFilter, setNameFilter] = useState("")
  const [stockInput, setStockInput] = useState({
    date: "" || Date.now(),
    goods: "",
    category: "",
    pcs: "",
    crt: "",
    qty: "",
    cost: "",
    sellingPrice: ""
  })

  /////////This loads the sales data once the page opens
  const account_id = auth.user._id
  const { fullName, businessName } = auth.user
  // console.log(account_id)
  const stockUrl = baseUrl + `/stock/${account_id}`
  const stockFilter = baseUrl + `/stock/filter/${account_id}`
  const stockUrl2 = baseUrl + "/stock/"
  // const profileUrl = baseUrl + `/profile/${account_id}`
  // const categoryUrl = baseUrl+"/category"
  useEffect(() => {
    try {
      axios.get(stockUrl).then((response) => {
        const data = response.data.Stock
        setStock(data)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try again later!")
      })
      // axios.get(profileUrl).then((response) => {
      //   console.log(response, "profile")
      // })
    } catch (err) { console.log(err.message) }
  }, [stockUrl])

  ///////////////////////////////////
  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setStockInput({
      ...stockInput, [name]: value
    })
  }

  const nameFilterChange = (e) => {
    e.preventDefault()
    console.log(e.target.value)
    setNameFilter(e.target.value)
  }
  const onFilterChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setFilterInput({
      ...filterInput, [name]: value
    })
  }

  const submitHandler = (e) => {
    e.preventDefault()
    const account_id = auth.user._id
    if (
      stockInput.date === "" &&
      stockInput.goods === "" &&
      stockInput.category === "" &&
      stockInput.pcs === "" &&
      stockInput.crt === "" &&
      stockInput.cost === "" &&
      stockInput.sellingPrice === ""
    ) {
      toast.error("Please enter the items")
      return
    }
    const calculatedQty = Number(stockInput.pcs) * Number(stockInput.crt)
    setStock((prev) => [
      ...prev,
      {
        id: new Date().getMilliseconds(),
        account: account_id,
        date: stockInput.date,
        goods: stockInput.goods,
        category: stockInput.category,
        pcs: Number(stockInput.pcs),
        crt: Number(stockInput.crt),
        qty: calculatedQty,
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
        pcs: Number(stockInput.pcs),
        crt: Number(stockInput.crt),
        qty: calculatedQty,
        cost: stockInput.cost,
        sellingPrice: stockInput.sellingPrice
      },
    ])

    setStockInput({
      date: "",
      goods: "",
      category: "",
      pcs: "",
      crt: "",
      qty: "",
      cost: "",
      sellingPrice: ""
    })
    // it should also send data to the backend from here and display it on the page at the same time
  }

  const filterHandler = (e) => {
    e.preventDefault()
    try {
      axios({
        method: 'post',
        url: stockFilter,
        data: filterInput
      }).then((response) => {
        console.log("filter posted", response.data.filter)
        const filter = response.data.filter
        if (filter.length === 0) {
          toast.error("There is no stock between these date")
        } else {
          setStock(filter)
        }
      }).catch((err) => {
        toast.error("Something went wrong with this search")
      })
    } catch (err) { console.log(err.message) }
    setFilterInput({
      from: "",
      to: ""
    })
    setOpen(false)
  }

  const nameFilterHandler = () => {
    console.log("search itme", nameFilter)
    const filtered = stock.filter((item) => item.goods === nameFilter || item.category === nameFilter)
    setStock(filtered)
    setNameFilter("")
    setOpen(false)
  }

  //////////////Delete/////////////
  const deleteHandler = item => {
    if (item.id !== undefined) {
      setStock(stock.filter(stocks => stocks.id !== item.id))
    }

    let profilePassword = prompt("Are you an admin, enter your password", "")

    if (profilePassword === null && profilePassword === "") {
      toast.info("Deletion cacelled as admin password is needed")
      return
    }

    if (item._id && profilePassword !== null) {
      const deleteItem = stock.filter(stock => stock._id === item._id)
      setStock(stock.filter(stock => stock._id !== item._id))
      const stockDeleteUrl = baseUrl + `/stock/${item.account}/${profilePassword}`
      try {
        axios({
          method: 'delete',
          url: stockDeleteUrl,
          data: deleteItem
        }).then((response) => {
          console.log(response, "delete")
          toast.success(response.data.message)
        }).catch((error) => {
          toast.error(error.response.data.message || "Something went wrong, try again later!")
        })
      } catch (err) { console.log(err.message) }
    }
  }

  const editHandler = value => {
    if (value.id !== undefined) {
      const editItem = stock.find(item => item._id === value.id)  //this serches the array to see if the object has the id and returns the object
      console.log(editItem, "edit item")
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
    let finished = window.confirm("Have you entered all the stocks?")
    if (finished) {
      try {
        axios({
          method: 'post',
          url: stockUrl2,
          data: stocks
        }).then((response) => {
          console.log("stock data posted", response)
          toast.success("Stocks Posted Successfully")
          // setError(<div className='relative flex bg-[#087c63] font-bold rounded-[30px] left-[40%] text-2xl text-white opacity-40 w-[350px] h-[50px] items-center justify-center'>Sales Posted Successfully</div>)
        }).catch((err) => {
          toast.error("something went wrong, please try again later!")
          console.log(err)
        })
      } catch (err) { console.log(err.message) }
      setStocks([])
    } else {
      toast.error("Only click SAVE if you have finished entering your data")
    }
  }


  const renderStock = stock.map((value, id) => {
    const { sellingPrice, date, goods, category, qty, pcs, cost } = value;
    const unit = qty / (pcs || 1)
    const rem = qty % pcs

    return (
      <>
        <div key={id} className='relative flex space-x-2 left-2 w-78 top-28 md:top-[2rem] md:left-60 md:mt-2 md:space-x-4'>
          <div className='table-header -mb-8'>{moment(date).format('DD/MM/YYYY')}</div>
          <div className='table-header -mb-8'>{category}</div>
          <div className='bg-gray-200 -mb-8 md:w-60 text-center h-10 justify-center rounded pt-2 text-xs md:text-lg pl-4'>{goods}</div>
          <div className='table-header -mb-8'>{pcs === undefined ? (qty + "pcs") : (unit + "crt" + " " + rem + "pcs")}</div>
          <div className='table-header -mb-8'>{cost}</div>
          <div className='table-header -mb-8'>{sellingPrice}</div>
        </div>
        <button className='btn7  relative top-[6.8rem] md:top-8 left-[106%] md:left-[85rem]' onClick={() => deleteHandler(value)}>Delete</button>
        <button className='btn7  relative top-[6.8rem] md:top-8 w-40 left-[106%] md:left-[85rem]' onClick={() => editHandler(value)}>Edit</button>
      </>
    )
  })
  console.log(stock, "stock", stocks)
  return (
    <div>
      <NavBar classStyle='fixed grid w-[100%] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center' />
      <Header pageTitle={" Stocks Page"} name={businessName} classStyle='bg-primary-200 h-36 w-[200vw] md:w-[100vw] flex' />
      <div className='absolute left top-22  container'>
        <form className='relative flex  left-2' onSubmit={submitHandler}>
          <input type='date' placeholder='date' className='btn6' name='date' value={stockInput.date} onChange={onChange} />
          <input type='text' placeholder='Category' className='btn6' name='category' value={stockInput.category} onChange={onChange} />
          <input type='text' placeholder='Available Goods' className='btn6' name='goods' value={stockInput.goods} onChange={onChange} />
          <input type='number' placeholder='Crt' className='btn6a' name='crt' value={stockInput.crt} onChange={onChange} />
          <input type='number' placeholder='Pcs per Crt' className='btn6b' name='pcs' value={stockInput.pcs} onChange={onChange} />
          <input type='number' placeholder='Cost Price N' className='btn6b' name='cost' value={stockInput.cost} onChange={onChange} />
          <input type='number' placeholder='Selling Price N' className='btn6b' name='sellingPrice' value={stockInput.sellingPrice} onChange={onChange} />
          <button type='submit' className='submit -left-[11rem] md:left-1' >Submit</button>
        </form>
      </div>
      <button type="button" className=' relative text-xs h-8 p-2 font-bold bg-gray-400 rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-40 md:h-12 md:text-lg md:font-bold md:left-[88rem] left-[36.5rem] md:top-4  top-9 md:ml-2;' onClick={() => setOpen(prev => !prev)}>Find Stock</button>
      {open ?
        <div className='absolute z-10 md:left-[75rem] left-[21rem] top-[13.3rem] w-[25.5rem] pt-2 pl-2 bg-white shadow-xl hover:shadow h-[6rem] rounded-md'>
          <form onSubmit={filterHandler} className='flex'>
            <div className='mr-1 text-xl'>From</div>
            <input type='date' name='from' className='w-[7rem] h-8 rounded-md mr-2 border-slate-400 border-2' value={filterInput.from} onChange={onFilterChange} />
            <div className='mr-1 text-xl'>to</div>
            <input type='date' name='to' className='w-[7rem] h-8 rounded-md border-slate-400 border-2' value={filterInput.to} onChange={onFilterChange} />
            <button type='submit' className='text-xs h-8 font-bold bg-gray-400 relative rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white w-[3.3rem] md:w-[4rem] md:h-8 md:text-lg md:font-bold md:left-1 md:top-1 ml-2'>Enter</button>
          </form>
          <div className='mt-2'>
            <div>
              <input type="text" value={nameFilter} onChange={nameFilterChange} placeholder='Search by Availbale goods' className='h-8 rounded-md w-[19rem] pl-2 border-slate-400 border-2' />
              <button type='submit' onClick={nameFilterHandler} className='text-xs h-8 font-bold bg-gray-400 relative rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-[4rem] w-[3.3rem] md:h-8 md:text-lg md:font-bold md:left-1 md:top-0 ml-2'>Enter</button>
            </div>
            <div>
              {stock.filter(item => {
                const searchItem = nameFilter.toLowerCase();
                const good = item.goods.toLowerCase();
                const cat = item.category.toLowerCase();
                return searchItem && (good.startsWith(searchItem) || cat.startsWith(searchItem)) && good !== searchItem
              }).slice(0, 10).map((item) =>
                <div onClick={() => setNameFilter(item.goods)}>{item.goods || item.category}</div>
              )}
            </div>
          </div>
        </div>
        :
        <></>
      }

      <div className='relative left-2 top-24 flex space-x-2 md:left-60 md:top-[2rem] md:flex md:space-x-4'>
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
