import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment';
import SideBar from '../../Utilities/SideBar'
import Header from '../../Utilities/Header'
import { useLocation, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../../Context/auth';
import { baseUrl, thousandSeperator } from '../../Utilities/helper';

function EachDebtor() {
  let initialValue
  const params = useParams()
  const auth = useAuth()
  const { fullName, businessName } = auth.user
  const { accountId, debtorId } = params

  const baseUrlxx = baseUrl + `/debt/${debtorId}`;
  const debtFilterUrl = baseUrl + `/debt/filter/${debtorId}`
  const baseUrl2b = baseUrl + '/debt';
  const baseUrl3 = baseUrl + "/debtorBal";
  const location = useLocation()
  const eachDebtor = (location.state)


  const [debtor, setDebtor] = useState([])
  const [debt, setDebt] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [isClose, setIsClose] = useState(false)
  const [open, setOpen] = useState(false)
  const [desc, setDesc] = useState([])
  const [description, setDescription] = useState("description")
  const [category, setCategory] = useState('')
  const [totalCash, setTotalCash] = useState(0)
  const [error, setError] = useState(null)
  const [nameFilter, setNameFilter] = useState("")
  const [filterInput, setFilterInput] = useState({
    from: "",
    to: ""
  })
  const [debtorInput, setDebtorInput] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })


  ////This fetches data from the backend and displays it here 
  useEffect(() => {
    if (location.state === null) return
    const { createdBy } = eachDebtor
    const baseUrl2 = baseUrl + `/stock/${createdBy}`
    //////////this will fetch the data of the individual client from the DB
    try {
      axios.get(baseUrlxx).then((response) => {
        setDebtor(() => response.data.debts)
      }).catch(error => {
        console.log(error, "see the error")
        setError(error)
      })
      axios.get(baseUrl2).then((response) => {
        // console.log(response.data.Stock, "debtor stock")
        setDesc(response.data.Stock)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try again later!")
      })
    } catch (err) { console.log(err.message) }
  }, [baseUrlxx, location.state, eachDebtor])


  // if(eachDebtor == null) return
  if (location.state === null) return
  const { firstName, lastName, createdBy, phoneNumber, _id } = eachDebtor

  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setDebtorInput({
      ...debtorInput, [name]: value
    })
  }

  ////////////////////Filter///////////////////
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
        url: debtFilterUrl,
        data: filterInput
      }).then((response) => {
        const filtered = response.data.filter
        setDebtor(filtered)
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
    const filtered = debtor.filter((item) => item.category === nameFilter || item.description === nameFilter)
    setDebtor(filtered)
    setFilterInput({
      from: "",
      to: ""
    })
    setOpen(false)
  }
  ///////////////////////////////////////////// 

  const submitHandler = (e) => {
    e.preventDefault()
    if (desc.length === 0) {
      return toast.error("please enter the goods inthe stock first, Thank you")
    }
    if (debtorInput.date === "" && debtorInput.category === "" && debtorInput.description === 0 && debtorInput.qty === 0 && debtorInput.rate === 0) {
      toast.error("Please input is empty, make sure you have put in all the data")
      return
    } else {
      setDebtor((prev) => [
        ...prev,
        {
          id: new Date().getMilliseconds(),
          date: debtorInput.date === "" ? new Date().toISOString().split('T')[0] : debtorInput.date,
          description: debtorInput.description,
          category: debtorInput.category,
          qty: debtorInput.qty,
          rate: debtorInput.rate,
          total: debtorInput.rate * debtorInput.qty
        },
      ])

      setDebt((prev) => [    //this is sent to the backend
        ...prev,
        {
          id: new Date().getMilliseconds(),
          debtorId,
          date: debtorInput.date === "" ? new Date().toISOString().split('T')[0] : debtorInput.date,
          description: debtorInput.description,
          category: debtorInput.category,
          qty: debtorInput.qty,
          rate: Number(debtorInput.rate),
          total: debtorInput.rate * debtorInput.qty,
          businessId: createdBy
        },
      ])
    }
    setDebtorInput({
      date: "",
      description: "",
      category: "",
      qty: "",
      rate: ""
    })
    setCategory("")
    setDescription("Description")
  }

  //////////////Delete/////////////
  const deleteHandler = (item) => {
    ////////if not saved at the backend, delte it from the front
    if (item.id !== undefined) {
      setDebtor(debtor.filter((element) => element.id !== item.id))
      toast.success("Item successfully deleted")
      return
    }

    let profilePassword = prompt("Are you an admin, enter your password", "")

    //////delete the credit details from the backend
    const deleteUrl = baseUrl + `/debt/${item._id}/${profilePassword}`;
    axios.delete(deleteUrl)
      .then((response) => {
        if (response.status === 200) {
          const afterDelete = debtor.filter((element) => element._id !== item._id)
          setDebtor(afterDelete)
          toast.success("Items successfully deleted")
          // window.location.reload()
        }
      }).catch(error => {
        console.log(error)
        toast.error(error.response.data.message)
      })
  }

  ///////////Edit///////////////
  // const editHandler = id => {
  //   const editItem = debtor.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  //   console.log(editItem)
  //   setDebtorInput({
  //     ...debtorInput,
  //     date: editItem.date,
  //     description,
  //     category,
  //     qty: editItem.qty,
  //     rate: editItem.rate,
  //   })
  //   deleteHandler(id)
  // } 


  //////////////////Category and Dropdown
  // const dropDownCategoryHandler = (value) => {
  //   setIsClose(false)
  //   setCategory(value)
  // }

  // const dropDownHandler = (event) => {
  //   setDescription(event.target.value)
  //   setIsOpen(false)
  // }


  ////////Total calculations are here////////////////////////////////

  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = debtorTotal - parseInt(cash)

    const amount = {
      paid: cash,
      balance: total,
      businessId: createdBy,
      debtorId: _id,
      phoneNumber,
      firstName,
      lastName,
      purchase: debtorTotal
    }
    axios({
      method: 'post',
      url: baseUrl3,
      data: amount
    }).then((response) => {
      console.log(response)
      toast.success("Cash paid recorded successfully")
    }).catch(error => {
      toast.error(error.response.data.message)
    })
  }

  ////////////////Total ends here///////////////////////

  ////////////Reducer/////////////
  const reducer = (accumulator, currentValue) => {
    const returns = accumulator + Number(currentValue.total)
    return returns
  }
  const debtorTotal = debtor.reduce(reducer, 0)

  /////////////Save to the backend//////
  const saveHandler = () => {
    if (debt.length === 0) {
      return toast.error("you have not entered any new data")
    }
    try {
      axios({
        method: 'post',
        url: baseUrl2b,
        data: debt
      }).then(() => {
        toast.success("Input is successfully saved at the database")
        setDebt([])
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try again later!")
      })
    } catch (err) {
      console.log(err.message)
      toast.error("Something went wrong while trying to save, please try again later")
    }
    // window.location.reload()
  }

  const renderDebtor = debtor.map((value, id) => {
    const { total, date, description, category, qty, rate } = value;
    return (
      <>
        <tr key={id} className='relative left-2 space-x-1 md:left-60 top-20 md:top-28 mt-2 flex md:space-x-4 w-[120vw] md:w-[100vw] -mb-7'>
          <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
          <td className='table-header'>{category}</td>
          <td className='bg-gray-200 w-40 h-10 rounded pt-2 flex justify-center text-xs md:text-xl md:w-60'>{description}</td>
          <td className='table-header'>{qty}</td>
          <td className='table-header'>{rate}</td>
          <td className='table-header'>{total}</td>
        </tr>
        <button className='w-20 h-8 text-sm bg-gray-400 ml-2 relative top-20 md:top-[6.7rem] rounded-md text-white font-bold md:text-lg shadow-xl hover:shadow hover:text-black hover:bg-white left-[29rem] md:left-[83.6rem]' onClick={() => deleteHandler(value)}>Delete</button>
        {/* <button className='btn7a btn7 left-3' onClick={() => editHandler(value.id)}>Edit</button> */}
      </>
    )
  })


  return (
    <div className=' w-[163vw]'>
      {/* <SideBar classStyle='fixed grid w-[163vw] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>

      </SideBar> */}
      {/* <Header pageTitle={" Debtor Page"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[163vw] md:w-[100vw] flex' /> */}
      <div className='relative left-60 md:left-80 -top-8 md:-top-12 font-bold text-sm md:text-3xl text-white md:text-gray-600'>{firstName + " " + lastName}</div>
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date' className='btn4' name='date' value={debtorInput.date} onChange={onChange} />
          {/* <input type='text' placeholder='Category' className='btn4' name='category' value={debtorInput.category} onChange={onChange}/> */}
          {/********************************/}
          {/* <div>
            <button type='button' className='btn4' onClick={() => setIsClose(!isClose)}>
              {category.length > 0 ? category : "Category"}
            </button>
            {isClose && (
              <div className='dropContainer'>
                {desc.map((item, index) => (
                  <div key={index} className='dropdown' onClick={() => dropDownCategoryHandler(item.category)}>{item.category}</div>
                ))}
              </div>
            )}
          </div> */}
          <input type='text' placeholder='Category' className='btn6' name='category' value={debtorInput.category} onChange={onChange} />
          {/********************************/}
          {/* <select className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[15rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4' value={description} onChange={dropDownHandler}>
            <option value=''>Description</option>
            {desc.map((item, index) => (
              <option key={index} value={item.goods} >{item.goods}</option>
              ))}
              </select> */}
          <input type='text' placeholder='Description' className='btn6' name='description' value={debtorInput.description} onChange={onChange} />
          {/*************************************/}
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={debtorInput.qty} onChange={onChange} />
          <input type='number' placeholder='Rate N' className='btn4' name='rate' value={debtorInput.rate} onChange={onChange} />
          <button type='submit' className='submit -left-[13.5rem] md:left-1'>Submit</button>
        </form>
      </div>
      <button type="button" className=' relative text-xs h-8 p-2 font-bold bg-gray-400 rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-40 md:h-12 md:text-lg md:font-bold md:left-[78.5rem] left-[31rem] md:top-4  top-9 md:ml-2;' onClick={() => setOpen(prev => !prev)}>Find Goods</button>
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
            <div>
              {debtor.filter(item => {
                const searchItem = nameFilter.toLowerCase();
                const good = item.description.toLowerCase();
                const cat = item.category.toLowerCase();
                return searchItem && (good.startsWith(searchItem) || cat.startsWith(searchItem)) && good !== searchItem
              }).slice(0, 10).map((item) =>
                <div onClick={() => setNameFilter(item.description)}>{item.description || item.category}</div>
              )}
            </div>
          </div>
        </div>
        :
        <></>
      }
      <table className='relative left-2 top-20 md:left-60 md:top-28 flex space-x-1 md:space-x-4 w-[120vw] md:w-[100vw]'>
        <th className='table-header'>Date</th>
        <th className='table-header'>Category</th>
        <th className='bg-gray-200 w-40 text-xs md:text-lg md:w-60 text-center h-10 rounded pt-2'>Goods Description</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      <div>
        {error ? error.message : renderDebtor}
      </div>
      <div className='relative w-[60%] md:w-[20%] md:left-[20rem] top-[6.5rem] md:top-40 space-y-4 shadow-xl hover:shadow rounded-xl'>
        {/* <div className='flex space-x-8'><div className='btn5'>Total: </div>
          <div className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 text-center text-[14px] md:text-base'>{thousandSeperator(debtorTotal)}</div>
        </div> */}
        <div className='flex space-x-8 pt-5 pb-5'>
          <div className='btn5'>Paid: </div>
          <input className='bg-gray-200 w-[8rem] md:w-[12rem] h-8 rounded pt-1 flex justify-center text-[14px] md:text-base text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment here' />
          <button className='w-20 h-7 bg-gray-400 ml-2 relative -left-3 md:left-3 top-1 rounded-md text-white font-bold text-base shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
        </div>
        {/* <div className='btn5'>Bal:</div><div className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 flex justify-center text-[14px] md:text-xl relative left-[7.25rem] -top-10'>{thousandSeperator(totalCash)}</div> */}
      </div>
      <button type='submit' onClick={saveHandler} className={debt.length === 0 ? 'unsave' : 'save'} disabled={debt.length === 0}>Save</button>
    </div>
  )
}

export default EachDebtor
