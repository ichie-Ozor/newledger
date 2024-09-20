import React, { useEffect, useState } from 'react'
import moment from 'moment';
// import { AuthContext } from '../../Context/auth'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
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
  const [creditor, setCreditor] = useState([])
  const [isOpen, setIsOpen] = useState(false) //// goods description dropdown
  const [isClose, setIsClose] = useState(false)
  const [desc, setDesc] = useState([])  /// goods description
  const [description, setDescription] = useState('')  /// goods description
  const [credit, setCredit] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [lists, setLists] = useState([])   //// category dropdown
  const [category, setCategory] = useState('')  ////category
  const [save, setSave] = useState(false)
  const [totalCash, setTotalCash] = useState(0)
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
  // console.log(eachCreditor)


  // const baseUrlxx = `baseUrl+/credit/${_id}`;

  const baseUrl2b = baseUrl + '/credit';
  const baseUrl3 = baseUrl + "/creditorBal";


  // const { category, setCategory } = useContext(AuthContext)
  ////This fetches data from the backend and displays it here 

  useEffect(() => {

    if (eachCreditor == null) return
    const { firstName, lastName, _id, createdBy } = eachCreditor
    // console.log(firstName,lastName, _id, createdBy, creditorId, "oga here")

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

  ////////Total calculations are here////////////////////////////////

  const cashHandler = (e) => {
    e.preventDefault()
    setCash(e.target.value)
    //  return bal = debtorTotal - cash
  }

  const totalCashHandler = (e) => {
    e.preventDefault()
    const total = creditorTotal - parseInt(cash)

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
    if (creditorInput.date === "" && creditorInput.category === "" && creditorInput.description === "" && creditorInput.qty === "" && creditorInput.rate === "") {
      return toast.error("Please put in the date or category")
    } else {
      setCreditor((prev) => [
        ...prev,
        {
          id: new Date().getMilliseconds(),
          date: creditorInput.date,
          description,
          category: category,
          qty: creditorInput.qty,
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
          description,
          category: category,
          qty: creditorInput.qty,
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
    // it should also send data to the backend from here and display it on the page at the same time
  }

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
      toast.success("Credit saved successfully")
    }).catch(error => {
      const id = error.response.data?.credit.id
      const removeIt = creditor.filter((item) => item.id !== id)
      setCreditor(removeIt)
      toast.error(error.response.data.message)
    })
    setCredit([])
    // window.location.reload()
  }

  const renderCreditor = creditor.map((value, id) => {
    const { date, total, description, category, qty, rate, } = value;
    return (
      <>   <tr key={id} className='relative space-x-1 left-2 top-10 md:left-[230px] md:top-28 mt-2 flex md:space-x-4 w-[120vw] md:w-[100vw] -mb-7'>
        <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
        <td className='table-header'>{category}</td>
        <td className='bg-gray-200 w-32 h-10 rounded pt-2 flex justify-center text-xs md:text-xl md:w-60'>{description}</td>
        <td className='table-header'>{qty}</td>
        <td className='table-header'>{rate}</td>
        <td className='table-header'>{total}</td>
      </tr>
        <button className='btn7  relative top-8 md:top-24 left-[121%] md:left-[83%]' onClick={() => deleteHandler(value)}>Delete</button>
        {/* <button className='btn7a btn7 left-3' onClick={() => editHandler(value.id)}>Edit</button> */}
      </>
    )
  })


  return (
    <div >
      <NavBar classStyle='fixed grid w-[153vw] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
        <Link className='no-underline' to={'transaction'} state={eachCreditor}>
          <button className='nav text-xs font-bold ml-3 mt-3 cursor-pointer text-white'>Check Balance</button>
        </Link>
      </NavBar>
      <Header pageTitle={" Creditor Page"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[153vw] md:w-[100vw] flex' />
      <div className='relative left-60 md:left-80 -top-8 md:-top-12 font-bold md:text-3xl text-white md:text-gray-600'>{firstName + " " + lastName}</div>
      <div className='absolute md:-left-3 top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date' className='btn4' name='date' value={creditorInput.date} onChange={onChange} />
          {/*************************/}
          <div>
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
          </div>
          {/*************************/}
          <select className='ml-1 top-7 text-xs -left-56 w-20 h-10 p-1 bg-white relative rounded-md shadow-xl hover:shadow md:w-[15rem] md:h-14 md:p-4 md:ml-3 md:text-lg md:left-1 md:top-4' value={description} onChange={dropDownHandler}>
            <option value=''>Description</option>
            {desc.map((item, index) => (
              <option key={index} value={item.goods} className='dropdown'>{item.goods}</option>
            ))}
          </select>
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={creditorInput.qty} onChange={onChange} />
          <input type='number' placeholder='Rate N' className='btn4' name='rate' value={creditorInput.rate} onChange={onChange} />
          <button type='submit' className='submit' >Submit</button>
        </form>
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

      <div className='relative md:left-[20rem] w-[100%] md:w-[25%] top-[6.5rem] md:top-40 space-y-4 shadow-xl hover:shadow rounded-xl'>
        <div className='flex space-x-8'><div className='btn5'>Total: </div>
          <div className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 text-center text-[14px] md:text-base'>{thousandSeperator(creditorTotal)}</div></div>
        <div className='flex space-x-8'>
          <div className='btn5'>Paid: </div>
          <input className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 flex justify-center text-[14px] md:text-base text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment' />
          <button className='w-20 h-7 bg-gray-400 ml-2 relative left-3 top-1 rounded-md text-white font-bold text-base shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
        </div>
        <div className='btn5'>Bal:</div><div className='bg-gray-200 w-[8rem] md:w-40 h-8 rounded pt-1 flex justify-center text-[14px] md:text-base relative left-[7.25rem] -top-10'>{thousandSeperator(totalCash)}</div>
      </div>
      <button type='submit' onClick={saveHandler} className={credit.length === 0 ? 'unsave' : 'save'} disabled={credit.length === 0}>Save</button>

    </div>
  )
}

export default EachCreditor
