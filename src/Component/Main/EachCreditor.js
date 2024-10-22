import React, { useEffect, useState } from 'react'
import moment from 'moment';
// import { AuthContext } from '../../Context/auth'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import Invoice from '../Invoice';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
import { useAuth } from '../../Context/auth';
import { baseUrl, thousandSeperator } from '../../Utilities/helper';


function EachCreditor(props) {
  let initialValue
  const params = useParams();
  const navigate = useNavigate()
  const auth = useAuth()
  const { fullName, businessName } = auth.user
  const { accountId, creditorId } = params
  const [invoice, setInvoice] = useState(false)
  const [creditor, setCreditor] = useState([])
  const [isOpen, setIsOpen] = useState(false) //// goods description dropdown
  const [isClose, setIsClose] = useState(false)
  const [desc, setDesc] = useState([])  /// goods description
  const [description, setDescription] = useState('')  /// goods description
  const [credit, setCredit] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [lists, setLists] = useState([])   //// category dropdown
  const [category, setCategory] = useState('')  ////category
  const [open, setOpen] = useState(false)
  const [isToggle, setIsToggle] = useState(false)
  const [filterInput, setFilterInput] = useState({
    from: "",
    to: ""
  })
  const [nameFilter, setNameFilter] = useState("")
  const [totalCash, setTotalCash] = useState(0)
  const [itemName, setItemName] = useState("")
  const [item, setItem] = useState()
  const [error] = useState(null)
  const [creditorInput, setCreditorInput] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

  const location = useLocation()
  // if(location.state === null){ console.log(error)}
  const eachCreditor = (location.state)

  // const baseUrlxx = `baseUrl+/credit/${_id}`;

  const baseUrl2b = baseUrl + '/credit';
  const baseUrl3 = baseUrl + "/creditorBal";
  const stockFilter = baseUrl + `/credit/filter/${auth.user._id}`


  ////This fetches data from the backend and displays it here 

  useEffect(() => {

    if (eachCreditor == null) return
    const { firstName, lastName, _id, createdBy } = eachCreditor

    const baseUrl2 = baseUrl + `/credit/${creditorId}`;
    const baseUrl5 = baseUrl + `/stock/${createdBy}`

    try {
      if (creditorId === 'dashboard') return
      axios.get(baseUrl2).then((response) => {
        const creditorData = response.data.credits
        setCreditor(creditorData)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try again later!")
      })
      axios.get(baseUrl5).then((response) => {
        // console.log(response.data.Stock, "see 71")
        setDesc(response.data.Stock)
      }).catch((error) => {
        toast.error(error.response.data.message || "Something went wrong, try aain later!")
      })
    } catch (err) { console.log(err.message) }
  }, [creditorId, eachCreditor])

  if (eachCreditor == null) return
  const { firstName, lastName, _id, createdBy, phoneNumber } = eachCreditor

  const onChange = (e) => {
    e.preventDefault()
    const { name, value } = e.target
    setCreditorInput({
      ...creditorInput, [name]: value
    })
  }

  //////////////////////////Search///////////////////////////
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
  const filterHandler = (e) => {
    e.preventDefault()
    try {
      axios({
        method: 'post',
        url: stockFilter,
        data: filterInput
      }).then((response) => {
        const filter = response.data.filter
        if (filter.length === 0) {
          toast.error("There is no stock between these date")
        } else {
          setCreditor(filter)
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
    console.log(creditor, "search itme", nameFilter)
    const filtered = creditor.filter((item) => item.description === nameFilter || item.category === nameFilter)
    setCreditor(filtered)
    setNameFilter("")
    setOpen(false)
  }
  //////////////////////////////////////////////////////////
  const itemNameHandler = (value) => {
    setItemName(value.goods || value.category)
    setItem(value)
  }
  ////////Total calculations are here////////////////////////////////

  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = creditorTotal - parseInt(cash)
    setTotalCash(total)
    const amount = {
      paid: cash,
      balance: total,
      businessId: createdBy,
      creditorId: _id,
      phoneNumber,
      firstName,
      lastName,
      purchase: creditorTotal
    }

    axios({
      method: 'post',
      url: baseUrl3,
      data: amount
    }).then((response) => {
      console.log(response.data.message)
      toast.success("Input is successfully saved at the database")
    }).catch(error => {
      console.log(error)
      toast.error(error.response.data.message)
    })
  }

  ////////////////Submit and sending to the backend starts here///////////////////////

  const submitHandler = (e) => {
    e.preventDefault()
    if (desc.length === 0) {
      return toast.error("please enter the goods inthe stock first, Thank you")
    }
    if (creditorInput.date === "" && (itemName !== item.goods || itemName !== item.category) && creditorInput.category === "" && creditorInput.description === "" && creditorInput.qty === "" && creditorInput.rate === "") {
      return toast.error("Please put in the date or category")
    } else {
      setCreditor((prev) => [
        ...prev,
        {
          id: new Date().getMilliseconds(),
          date: creditorInput.date,
          description: item.goods,
          category: item.category,
          qty: creditorInput.qty,
          amt: isToggle ? 'crt' : 'pcs',
          rate: creditorInput.rate,
          total: creditorInput.rate * creditorInput.qty
        },
      ])

      setCredit((prev) => [
        ...prev,
        {
          id: new Date().getMilliseconds(),
          creditorId: _id,
          date: creditorInput.date,
          description: item.goods,
          category: item.category,
          qty: creditorInput.qty,
          amt: isToggle ? 'crt' : 'pcs',
          rate: Number(creditorInput.rate),
          total: creditorInput.rate * creditorInput.qty,
          businessId: createdBy
        }
      ])
    }
    setCreditorInput({
      date: "",
      description: "",
      category: "",
      qty: "",
      rate: ""
    })
    setDescription('')
    setCategory('')
    setItemName("")
  }
  console.log(creditor, "ccccccccc", credit)
  //////////////Delete/////////////
  const deleteHandler = value => {

    /////////if its not saved at the back, delete it from the front only
    if (value.id !== undefined) {
      setCreditor(creditor.filter(stocks => stocks.id !== value.id))
      toast.success("Items successfully deleted")
      return
    }

    let profilePassword = prompt("Are you an admin, enter your password", "")

    if (profilePassword === null && profilePassword === "") {
      toast.info("Deletion cacelled as admin password is needed")
      return
    }
    //////delete the credit details from the backend
    if (profilePassword !== null) {
      const deleteUrl = baseUrl + `/credit/${value._id}/${profilePassword}`;
      axios.delete(deleteUrl)
        .then((response) => {
          if (response.status === 200) {
            const afterDelete = creditor.filter((item) => item._id !== value._id)
            setCreditor(afterDelete)
            toast.success("Items successfully deleted")
            // window.location.reload()
          }
        })
        .catch(error => {
          console.log(error, "error")
          toast.error(error.response.data.message || "An error occurred while deleting the item")
        })
    }
  }

  //////////////Edit//////////////////////
  // const editHandler = id => {
  //   const editItem = creditor.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object

  //   setCreditorInput({
  //     ...creditorInput,
  //     date: editItem.date,
  //     description,
  //     category,
  //     qty: editItem.qty,
  //     rate: editItem.rate,
  //   })
  //   deleteHandler(id)
  // } 


  ////////////Reducer/////////////
  const reducer = (accumulator, currentValue) => {
    const returns = accumulator + Number(currentValue.total)
    return returns
  }
  const creditorTotal = creditor.reduce(reducer, 0)


  ////////////////////////////////////////dropdown//////////////
  const dropDownHandler = (event) => {
    setDescription(event.target.value)
    setIsOpen(false)
  }
  const dropDownCategoryHandler = (value) => {
    setIsClose(false)
    setCategory(value)
  }

  const amountToggle = () => {
    setIsToggle(!isToggle)
  }
  ///////////Save to the backend//////
  const saveHandler = () => {
    if (credit.length === 0) {
      return toast.error("you have not entered any new data")
    }
    axios({
      method: 'post',
      url: baseUrl2b,
      data: credit
    }).then((response) => {
      console.log(response, "credit response")
      toast.success("Credit saved successfully")
    }).catch(error => {
      console.log(error, "credit error")
      const id = error.response.data?.credit.id
      const removeIt = creditor.filter((item) => item.id !== id)
      setCreditor(removeIt)
      toast.error(error.response.data.message)
    })
    setCredit([])
    // window.location.reload()
  }

  const renderCreditor = creditor.map((value, id) => {
    const { date, total, description, category, qty, rate, amt } = value;
    console.log(amt, "amt", typeof qty)
    return (
      <>   <tr key={id} className='relative space-x-1 left-2 top-10 md:left-[230px] md:top-28 mt-2 flex md:space-x-4 w-[120vw] md:w-[100vw] -mb-7'>
        <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
        <td className='table-header'>{category}</td>
        <td className='bg-gray-200 w-32 h-10 rounded pt-2 flex justify-center text-xs md:text-xl md:w-60'>{description}</td>
        <td className='table-header'>{amt === undefined ? qty : qty + amt}</td>
        <td className='table-header'>{rate}</td>
        <td className='table-header'>{total}</td>
      </tr>
        <button className='btn7  relative top-8 md:top-[6.5rem] left-[121%] md:left-[83rem]' onClick={() => deleteHandler(value)}>Delete</button>
        {/* <button className='btn7a btn7 left-3' onClick={() => editHandler(value.id)}>Edit</button> */}
      </>
    )
  })

  console.log(creditor, "creditor")
  return (
    <div >
      <NavBar classStyle='fixed grid w-[153vw] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
        <Link className='no-underline' to={'transaction'} state={eachCreditor}>
          <button className='text-xs font-bold ml-3 mt-3 cursor-pointer text-white'>Check Balance</button>
        </Link>
      </NavBar>
      <Header pageTitle={" Creditor Page"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[153vw] md:w-[100vw] flex' />
      <div className='relative left-60 md:left-80 -top-8 md:-top-12 font-bold md:text-3xl text-white md:text-gray-600'>{firstName + " " + lastName}</div>
      {invoice ?
        <Invoice closeInvoice={() => setInvoice(false)} /> :
        (<>
          <div className='absolute md:-left-3 top-22 '>
            <form className='relative flex  left-56' onSubmit={submitHandler}>
              <input type='date' placeholder='date' className='btn4' name='date' value={creditorInput.date} onChange={onChange} />
              {/****************************/}
              <input type='text' placeholder='search for goods' value={itemName} onChange={(e) => setItemName(e.target.value)} className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[26rem] md:h-14 md:p-4 md:pl-8 md:ml-3 md:text-lg md:left-1 md:top-4' />
              <div className='absolute top-[73px] left-[11.5rem] z-10 w-[26rem] bg-white shadow-md rounded-lg'>
                {desc.filter(item => {
                  console.log(item, itemName, "listtttt")
                  const searchItem = itemName.toLowerCase();
                  const cat = item.category.toLowerCase();
                  const good = item.goods.toLowerCase();
                  return searchItem && (good.startsWith(searchItem) || cat.startsWith(searchItem)) && good !== searchItem
                }).map((t) => <div onClick={() => itemNameHandler(t)} className='p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200'>{t.description || t.category}</div>)}
              </div>
              {/*********************************/}
              {/*************************/}
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
              {/*************************/}
              {/* <select className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[15rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4' value={description} onChange={dropDownHandler}>
                <option value=''>Description</option>
                {desc.map((item, index) => (
                  <option key={index} value={item.goods} className='dropdown'>{item.goods}</option>
                ))}
              </select> */}
              <input type='number' placeholder='Qty' className='btn4' name='qty' value={creditorInput.qty} onChange={onChange} />
              <div type="text" onClick={amountToggle} className={isToggle ? 'crt' : 'pcs'}>{isToggle ? "crt" : "pcs"}</div>
              <input type='number' placeholder='Rate N' className='btn4' name='rate' value={creditorInput.rate} onChange={onChange} />
              <button type='submit' className='submit -left-[13.5rem] md:left-1' >Submit</button>
            </form>
            {/*********************************************************************/}
            <button type="button" className=' relative text-xs h-8 p-2 font-bold bg-gray-400 rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-40 md:h-12 md:text-lg md:font-bold md:left-[86.5rem] left-[31rem] md:-top-10 -top-1 md:ml-2;' onClick={() => setOpen(prev => !prev)}>Search</button>
            {open ?
              <div className='absolute z-10 md:left-[75rem] left-[13rem] top-[4.3rem] md:top-[4.4rem] w-[25.5rem] pt-2 pl-2 bg-white shadow-xl hover:shadow h-[6rem] rounded-md'>
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
                    {creditor.filter(item => {
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
            {/*********************************************************************/}
            {/* <button type='button' className=' relative -left-[11rem] top-9 text-xs h-8 p-2 font-bold bg-gray-400 rounded-md shadow-xl hover:shadow hover:text-black hover:bg-white text-white md:w-40 md:h-12 md:text-lg md:font-bold md:left-[84rem] md:-top-10 md:ml-2' onClick={() => setInvoice(true)}>Invoice</button> */}
          </div>
          <table className='relative left-2 top-20 md:left-[230px] md:top-28 flex space-x-1 md:space-x-4 w-[120vw] md:w-[100vw]'>
            <th className='table-header'>Date</th>
            <th className='table-header'>Category</th>
            <th className='bg-gray-200 w-[8rem] text-xs md:w-60 h-10 rounded pt-2 md:text-lg'>Goods Description</th>
            <th className='table-header'>Quantity</th>
            <th className='table-header'>Rate</th>
            <th className='table-header'>Total</th>
          </table>
          <div className='relative top-10 md:top-0'>
            {error ? error.message : renderCreditor}
          </div>

          <div className='relative md:left-[20rem] w-[100%] md:w-[25%] top-[6.5rem] md:top-40 space-y-4 shadow-xl hover:shadow rounded-xl pb-3'>
            <div className='flex space-x-8'><div className='btn5'>Total: </div>
              <div className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 text-center text-[14px] md:text-base'>{thousandSeperator(creditorTotal)}</div></div>
            <div className='flex space-x-8'>
              <div className='btn5'>Paid: </div>
              <input className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 flex justify-center text-[14px] md:text-base text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment' />
              <button className='w-20 h-7 bg-gray-400 ml-2 relative left-3 top-1 rounded-md text-white font-bold text-base shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
            </div>
            {/* <div className='btn5'>Bal:</div><div className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 flex justify-center text-[14px] md:text-base relative left-[7.25rem] -top-10'>{thousandSeperator(totalCash)}</div> */}
          </div>
          <button type='submit' onClick={saveHandler} className={credit.length === 0 ? 'unsave' : 'save'} disabled={credit.length === 0}>Save</button>
        </>
        )}
    </div>
  )
}

export default EachCreditor
