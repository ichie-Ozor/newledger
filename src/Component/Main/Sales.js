import React, { useEffect, useState } from 'react'
import moment from 'moment';
// import { Typeahead } from 'react-bootstrap-typeahead';
import NavBar from '../../Utilities/NavBar'
// import { useLocation } from 'react-router-dom';
import Header from '../../Utilities/Header'
import { useAuth } from '../../Context/auth'
import axios from 'axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { baseUrl } from '../../Utilities/helper';

function Sales() {
  const navigate = useNavigate()
  // const location = useLocation()
  // const list = location.state
  const [sales, setSales] = useState([])
  const [bank, setBank] = useState("")
  const [sale, setSale] = useState([])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [isOpen, setIsOpen] = useState(false) //// goods category dropdown
  const [isClose, setIsClose] = useState(false)  /// goods description
  const [category, setCategory] = useState([])  ///category
  const [description, setDescription] = useState([])
  const [isToggle, setIsToggle] = useState(false)
  const [lists, setLists] = useState([]) ///category
  const auth = useAuth()
  const [filterInput, setFilterInput] = useState({
    from: "",
    to: ""
  })
  const [item, setItem] = useState()
  const [itemName, setItemName] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [salesInput, setSalesInput] = useState({
    date: "",
    description: "",
    category: "",
    // pcs: "",
    // crt: "",
    amt: "",
    cost: "",
    qty: "",
    rate: ""
  })

  /////////This loads the sales data once the page opens
  const account_id = auth.user._id
  const salesUrlxx = baseUrl + "/sales/"
  const salesUrl = baseUrl + `/sales/${account_id}`
  const salesFilterUrl = baseUrl + `/sales/filter/${account_id}`
  const baseUrl5 = baseUrl + `/stock/${account_id}`
  useEffect(() => {
    try {
      axios.get(salesUrl).then((response) => {
        console.log(response, "sales response")
        const data = response.data.sales
        setSales(data)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went worng, try again later!")
      })
      axios.get(baseUrl5).then((response) => {
        const data = response.data.Stock
        console.log(data, "Stock details")
        setLists(data)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try again later!")
      })
    } catch (err) { console.log(err.message) }
  }, [salesUrl, baseUrl5])


  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setSalesInput({
      ...salesInput, [name]: value
    })
  }

  const { fullName, businessName } = auth.user

  const submitHandler = async (e) => {
    e.preventDefault()
    // console.log(item, "item submit")
    if (salesInput.date === "" && (itemName !== item.goods || itemName !== item.category) && salesInput.pcs === "" && salesInput.crt === "" && salesInput.rate === "") return toast.error("please enter the items")
    if (lists.length === 0) {
      return toast.error("please enter the goods inthe stock first, Thank you")
    }
    const account_id = auth.user._id
    // const calculatedQty = Number(salesInput.pcs) * Number(salesInput.crt || 1)
    setSales((prev) => [
      ...prev,
      {
        id: new Date().getMilliseconds(),
        account: account_id,
        date: salesInput.date === "" ? new Date().toISOString().split('T')[0] : salesInput.date,
        description: item.goods,
        category: item.category,
        cost: item.cost,
        // pcs: Number(salesInput.pcs),
        // crt: Number(salesInput.crt),
        amt: isToggle ? 'crt' : 'pcs',
        // qty: calculatedQty,
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
        date: salesInput.date === "" ? new Date().toISOString().split('T')[0] : salesInput.date,
        description: item.goods,
        category: item.category,
        cost: item.cost,
        // pcs: Number(salesInput.pcs),
        // crt: Number(salesInput.crt),
        amt: isToggle ? 'crt' : 'pcs',
        // qty: calculatedQty,
        qty: salesInput.qty,
        rate: salesInput.rate,
        total: salesInput.rate * salesInput.qty
      },
    ])
    // const sale = {
    //   id: new Date().getMilliseconds(),
    //   account: account_id,
    //   date: salesInput.date,
    //   description: description,
    //   category: category,
    //   qty: salesInput.qty,
    //   rate: salesInput.rate,
    //   total: salesInput.rate * salesInput.qty
    // }

    // await axios({
    //   method: 'post',
    //   url: salesUrl,
    //   data: sale
    // }).then((response) => {
    //   console.log(response)
    //   toast.success(response.data.message)
    // }).catch((error) => {
    //   console.log(error)
    //   toast.error(error.response.data.message)
    //   const id = sale.id
    //   const removeIt = sales.filter((item) => item.id !== id)
    //   setSales(removeIt)
    // })


    setSalesInput({
      date: "",
      description: "",
      category: "",
      // pcs: "",
      // crt: "",
      qty: "",
      rate: ""
    })
    setCategory('')
    setDescription('')
    setItemName("")
    if (isToggle) amountToggle()
  }

  const amountToggle = () => {
    setIsToggle(!isToggle)
  }
  ///////// it should also send data to the backend from here and display it on the page at the same time
  // const saveHandler = async() => {
  async function saveHandler() {
    let finished = window.confirm("Have you entered all the sales?")
    if (finished) {
      console.log(sale, "aiossssss")
      try {
        await axios({
          method: 'post',
          url: salesUrlxx,
          data: sale
        }).then((r) => {
          console.log(r, "returned")
          toast.success("Sales Posted Successfully")
        }).catch((error) => {
          console.log(error, "error")
          toast.error(error.response.data.message || "Something went wrong, try again later!")
        })
      } catch (err) {
        toast.error(err.response.data.message)
        const id = await err.response.data?.sale.id
        const removeIt = sales.filter((item) => item.id !== id)
        setSales(removeIt)
      }
      setSale([])
    } else {
      toast.error("Only click SAVE if you have finished entering your data")
    }
  }

  /////////////Dropdown///////////
  // const dropDownDescHandler = (value) => {
  //   setIsClose(false)
  //   setDescription(value)
  // }
  // const dropDownHandler = (value) => {
  //   setIsOpen(false)
  //   setCategory(value)
  // }
  //////////////Delete/////////////
  const deleteHandler = item => {
    if (item.id !== undefined) {
      const id = item.id
      setSales(sales.filter(sale => sale.id !== id))
    }

    let profilePassword = prompt("Are you an admin, enter your password", "")

    if (profilePassword === null && profilePassword === "") {
      toast.info("Deletion cacelled as admin password is needed")
      return
    }

    //this is the singular item that i want deleted being sent to the backend
    if (item._id && profilePassword !== null) {
      const id = item._id
      const deleteItem = sales.filter(sale => sale._id === id)
      setSales(sales.filter(sale => sale._id !== id))
      const salesDeleteUrl = baseUrl + `/sales/${id}/${profilePassword}`

      try {
        axios({
          method: 'delete',
          url: salesDeleteUrl,
          data: deleteItem
        }).then((response) => {
          toast.error(response.message)
        }).catch((error) => {
          toast.error(error.response.data.message || "Something went wrong, try again later")
        })
      } catch (err) {
        console.log(err.message)
        toast.error("you are not allowed to do this" || err.message)
      }
    }
  }

  /////////////Edit////////////////
  // const editHandler = id => {
  //   const editItem = sales.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object

  //   setSalesInput({
  //     ...salesInput,
  //     date: moment(editItem.date).format('DD/MM/YYYY'),
  //     availGoods: editItem.availGoods,
  //     category: editItem.category,
  //     qty: editItem.qty,
  //     cPrice: editItem.cPrice,
  //     sPrice: editItem.sPrice
  //   })
  //   deleteHandler(id)
  // }



  ////////////Reducer/////////////
  const reducer = (accumulator, currentValue) => {
    const returns = accumulator + Number(currentValue.total)
    return returns
  }
  const costReducer = (accumulator, currentValue) => {
    const returns = accumulator + currentValue.cost
    return returns
  }
  const salesTotal = sales.reduce(reducer, 0)
  const salesCost = sales.reduce(costReducer, 0)
  const grossProfit = salesTotal - salesCost
  ////////////////sales filter///////////////
  const nameFilterChange = (e) => {
    e.preventDefault()
    console.log(e.target.value)
    setNameFilter(e.target.value)
  }

  const onDateFilterChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setFilterInput({
      ...filterInput, [name]: value
    })
  }

  const dateFilterHandler = (e) => {
    e.preventDefault()
    try {
      axios({
        method: 'post',
        url: salesFilterUrl,
        data: filterInput
      }).then((response) => {
        const filtered = response.data.filter
        setSales(filtered)
      })
    } catch (err) { console.log(err.message) }
    setFilterInput({
      from: "",
      to: ""
    })
    setOpen(false)
  }

  const nameFilterHandler = () => {
    console.log("name filter handler clikec", nameFilter)
    const filtered = sales.filter((item) => item.category === nameFilter || item.description === nameFilter)
    setSales(filtered)
    setFilterInput({
      from: "",
      to: ""
    })
    setOpen(false)
  }

  const itemNameHandler = (value) => {
    setItemName(value.goods || value.category)
    setItem(value)
  }
  // console.log(sales, "salesssss", sale)
  /////////////////////////////////////////
  const renderSales = sales.map((value, id) => {

    const { total, date, description, pcs, category, crt, qty, rate, amt } = value;

    // const unit = qty / (pcs || 1)
    // const rem = qty % pcs
    return (
      <>
        <tr key={id} className='relative top-20 left-2 md:left-60 md:top-14 mt-1 -mb-8 flex space-x-1 md:space-x-4  w-[110vw]'>
          <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
          <td className='table-header'>{category}</td>
          <td className='bg-gray-200 w-40 md:w-60 h-10 rounded pt-2 flex justify-center text-xs md:text-xl'>{description}</td>
          {/* <td className="table-header">
            {crt && !pcs ? `${crt} crt` : ""}
            {pcs && !crt ? `${pcs} pcs` : ""}
            {crt && pcs ? `${crt} crt ${pcs} pcs` : ""}
            {qty ? `${qty}` : ""}
          </td> */}
          <td className='table-header'>{amt === undefined ? qty : qty + amt}</td>
          <td className='table-header'>{rate}</td>
          <td className='table-header'>{total}</td>
        </tr>
        <button className='btn7  relative top-[5rem] md:top-12 left-[26.1rem] md:left-[83.5rem]' onClick={() => deleteHandler(value)}>Delete</button>
        {/* <button className='btn7  relative top-12 md:top-20 left-[111%] md:left-[85.2%]' onClick={() => editHandler(value.id)}>Edit</button> */}
      </>
    )
  })
  // console.log(bank, "bank")
  return (
    <div>
      <NavBar classStyle='fixed grid w-[146vw] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
        {/* <div className='absolute top-[1rem] text-xs font-bold left-[0.767rem] cursor-pointer' onClick={() => navigate(-1)} >BACK</div> */}
      </NavBar>
      <Header pageTitle={" Sales Page"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[146vw] md:w-[100vw] flex' />
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date' className='btn4' name='date' value={salesInput.date} onChange={onChange} />
          {/****************************/}
          <input type='text' placeholder='search for goods' value={itemName} onChange={(e) => setItemName(e.target.value)} className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[25rem] md:h-14 md:p-4 md:pl-8 md:ml-3 md:text-lg md:left-1 md:top-4' />
          <div className='absolute top-[73px] left-[11.5rem] z-10 w-[26rem] bg-white shadow-md rounded-lg'>
            {lists.filter(item => {
              const searchItem = itemName.toLowerCase();
              const cat = item.category.toLowerCase();
              const good = item.goods.toLowerCase();
              return searchItem && (good.startsWith(searchItem) || cat.startsWith(searchItem)) && good !== searchItem
            }).map((t) => <div onClick={() => itemNameHandler(t)} className='p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200'>{t.description || t.category}</div>)}
          </div>
          {/*********************************/}
          {/* <div>
            <button type='button' className='btn4' onClick={() => setIsOpen(!isOpen)}>
              {category.length > 0 ? category : "Category"}
            </button>
            {isOpen && (
              <div className='dropContainer'>
                {lists.map((item, index) => (
                  <div key={index} className='dropdown' onClick={() => dropDownHandler(item.category)}>{item.category}</div>
                ))}
              </div>
            )}
          </div>
          <div>
            <button type='button' className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[15.5rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4' onClick={() => setIsClose(!isClose)}>
              {description.length > 0 ? description : "Description"}
            </button>
            {isClose && (
              <div className='dropContainer'>
                {lists.map((item, index) => (
                  <div key={index} className='dropdown' onClick={() => dropDownDescHandler(item.goods)}>{item.goods}</div>
                ))}
              </div>
            )}
          </div> */}
          {/*********************/}
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={salesInput.qty} onChange={onChange} />
          <div type="text" onClick={amountToggle} className={isToggle ? 'crt' : 'pcs'}>{isToggle ? "crt" : "pcs"}</div>
          {/* <input type='number' placeholder='Crt' className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[7rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4' name='crt' value={salesInput.crt} onChange={onChange} /> */}
          {/* <input type='number' placeholder='Pcs/crt' className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[7rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4' name='pcs' value={salesInput.pcs} onChange={onChange} /> */}
          <input type='number' placeholder='Rate N' className='btn4' name='rate' value={salesInput.rate} onChange={onChange} />
          <div className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[8.7rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4 text-gray-400' onClick={() => setIsOpen(true)}>Payment type</div>
          {isOpen ?
            <div className='absolute top-20 z-10 bg-white shadow-xl hover:shadow rounded-md md:w-[8.7rem] md:h-14 '>
              <div><span>POS</span><input type='radio' /></div>
              <div><span>Transfer</span><input type='radio' /></div>
            </div> :
            <></>
          }
          {/* <select className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[8.7rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4 text-gray-400'>
            <option value="">Payment</option>
            <option value="saab">POS</option>
            <option value="opel">Cash</option>
            <option><input placeholder='Bank' name="bank" value={bank} onChange={() => setBank(bank)} /></option>
          </select> */}
          <button type='submit' className='submit -left-[13.5rem] md:left-3'>Submit</button>
        </form>
      </div>
      <button type="button" className=' relative text-xs h-8 p-2 font-bold bg-gray-400 rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-40 md:h-12 md:text-lg md:font-bold md:left-[97.5rem] left-[26rem] md:top-4  top-9 md:ml-2;' onClick={() => setOpen(prev => !prev)}>Find Sales</button>
      {open ?
        <div className='absolute z-10 md:left-[75rem] left-[11rem] top-[13.3rem] w-[25.5rem] pt-2 pl-2 bg-white shadow-xl hover:shadow h-[6rem] rounded-md'>
          <form onSubmit={dateFilterHandler} className='flex'>
            <div className='mr-1 text-xl'>From</div>
            <input type='date' name='from' className='w-[7rem] h-8 rounded-md mr-2 border-slate-400 border-2' value={filterInput.from} onChange={onDateFilterChange} />
            <div className='mr-1 text-xl'>to</div>
            <input type='date' name='to' className='w-[7rem] h-8 rounded-md border-slate-400 border-2' value={filterInput.to} onChange={onDateFilterChange} />
            <button type='submit' className='text-xs h-8 font-bold bg-gray-400 relative rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white w-[3.3rem] md:w-[4rem] md:h-8 md:text-lg md:font-bold md:left-1 md:top-1 ml-2'>Enter</button>
          </form>
          <div className='mt-2'>
            <div>
              <input type="text" value={nameFilter} onChange={nameFilterChange} placeholder='Search by goods sold' className='h-8 rounded-md w-[19rem] pl-2 border-slate-400 border-2' />
              <button type='submit' onClick={nameFilterHandler} className='text-xs h-8 font-bold bg-gray-400 relative rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-[4rem] w-[3.3rem] md:h-8 md:text-lg md:font-bold md:left-1 md:top-0 ml-2'>Enter</button>
            </div>
            <div className='absolute top-[73px] left-[11.5rem] z-10 w-[26rem] bg-white shadow-md rounded-lg'>
              {sales.filter(item => {
                const searchItem = nameFilter.toLowerCase();
                const good = item.description.toLowerCase();
                const cat = item.category.toLowerCase();
                return searchItem && (good.startsWith(searchItem) || cat.startsWith(searchItem)) && good !== searchItem
              }).slice(0, 10).map((item) =>
                <div onClick={() => setNameFilter(item.description)} className='p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200'>{item.description || item.category}</div>
              )}
            </div>
          </div>
        </div>
        :
        <></>
      }
      <table className='relative left-2 top-20 space-x-1 md:left-60 md:top-12 flex md:space-x-4  w-[110vw]'>
        <th className='flex text-center justify-center bg-gray-200 w-[6rem] md:w-[9.7rem] h-10 rounded pl-6 pr-6 pt-2 text-xs md:text-lg'>Date</th>
        <th className='table-header'>Category</th>
        <th className='text-xs bg-gray-200 w-28 md:w-60 text-center h-10 rounded pt-2 md:text-lg'>Sales Description</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      {error}
      <div>{renderSales}</div>
      <div className='relative w-[20.5rem] h-40 items-center justify-center pt-10 md:left-[25rem] left-[1.5rem] top-28 md:top-20 space-y-8 shadow-xl hover:shadow md:w-[29rem] rounded-xl'>
        <div className='flex space-x-8  mb-4'>
          <div className='btn5'>Total : </div>
          <div className='bg-gray-200 w-[12rem] md:w-72 h-10 rounded pt-2 text-center text-xl'>{salesTotal}</div>
        </div>
        <div className='flex space-x-8  mb-4'>
          <div className='btn5'>Gross Profit : </div>
          <div className='bg-gray-200 w-[12rem] md:w-72 h-10 rounded pt-2 text-center text-xl'>{grossProfit}</div>
        </div>
      </div>
      <button className={sale.length === 0 ? 'unsave' : 'save'} onClick={saveHandler} disabled={sale.length === 0}>Save</button>
    </div>
  )
}

export default Sales
