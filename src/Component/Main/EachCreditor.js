import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import moment from 'moment';
// import { AuthContext } from '../../Context/auth'
import NavBar from '../../Utilities/NavBar'
import Header from '../../Utilities/Header'
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
import { useAuth } from '../../Context/auth';


function EachCreditor(props) {
  let initialValue 
  const params = useParams();
  const navigate = useNavigate()
  const auth = useAuth()
  const {fullName, businessName} = auth.user.response.data.userDetail
  const {accountId, creditorId} = params
  const [ creditor, setCreditor ] = useState([])
  const [isOpen, setIsOpen] = useState(false) //// goods description dropdown
  const [isClose, setIsClose] = useState(false)
  const [desc, setDesc] = useState([])  /// goods description
  const [description, setDescription] = useState('')  /// goods description
  const [credit, setCredit] = useState([])
  const [cash, setCash] = useState(initialValue)
  const [lists, setLists] = useState([])   //// category dropdown
  const [category, setCategory] = useState('')  ////category
  const [save, setSave] = useState(false)
  const [ totalCash, setTotalCash ] = useState(0)
  const [error] = useState(null)
  const [ creditorInput, setCreditorInput ] = useState({
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
  

    // const baseUrl = `http://localhost:8080/credit/${_id}`;
    
    const baseUrl2b = 'http://localhost:8080/credit';
    const baseUrl3 = "http://localhost:8080/creditorBal";
    
  
    // const { category, setCategory } = useContext(AuthContext)
  ////This fetches data from the backend and displays it here 

useEffect(()=> {
  
  if(eachCreditor == null) return
  const {firstName, lastName,  _id, createdBy} = eachCreditor
  console.log(firstName,lastName, _id, createdBy, creditorId, "oga here")

  const baseUrl2 = `http://localhost:8080/credit/creditor/${creditorId}`;
  // const baseUrl4 = `http://localhost:8080/category/${createdBy}`
  const baseUrl5 = `http://localhost:8080/stock/${createdBy}`

  try{
    if(creditorId == 'dashboard') return
   axios.get(baseUrl2).then((response) => {
     console.log(response)
     const creditorData = response.data.credits
     setCreditor(creditorData)
   })
  //  axios.get(baseUrl4).then((response) => {
  //   console.log(response.data.category, "see 59")
  //   setLists(response.data.category)
  //  })
   axios.get(baseUrl5).then((response) => {
    console.log(response.data.Stock, "see 71")
    setDesc(response.data.Stock)
   })
  }catch(err){console.log(err.message)} 
 }, [creditorId, eachCreditor])

 if(eachCreditor == null) return
  const {firstName, lastName,  _id, createdBy, phoneNumber} = eachCreditor
  // console.log(firstName,lastName, _id, createdBy, creditorId, "oga here")
// let list = []
// let goodsDesc =[]

// lists.map((item) => {
//   return list.push(item.name)
// })
// desc.map((item) => {
//   return goodsDesc.push(item.goods)
// })
// console.log( desc)


const onChange = (e) => {
  e.preventDefault()
  const { name, value } = e.target
  setCreditorInput({
    ...creditorInput, [name] : value
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
    console.log(creditorTotal)
    setTotalCash(total)
  }
  // console.log(totalCash, cash)
     
  ////////////////Submit and sending to the backend starts here///////////////////////

  const submitHandler = (e) => {
    e.preventDefault()
    // console.log("see us")
   if(creditorInput.date === "" && category === "") {
    toast.error("Please put in the date or category")
        }else{
        setCreditor((prev) => [    
          ...prev,
          {
            id: new Date().getMilliseconds(),
            date: creditorInput.date,
            // description: creditorInput.description,
            description,
            category: category,
            qty: creditorInput.qty,
            rate: creditorInput.rate,
            total: creditorInput.rate * creditorInput.qty
          },
        ])
        
        setCredit((prev) => [    //this is sent to the backend
          ...prev,
          {
            id: new Date().getMilliseconds(),
            creditorId: _id,
            date: creditorInput.date,
            // description: creditorInput.description,
            description,
            category: category,
            qty: creditorInput.qty,
            rate: Number(creditorInput.rate),
            total: creditorInput.rate * creditorInput.qty,
            businessId: createdBy
          },
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
  
  console.log(creditor, credit)
 //////////////Delete/////////////
const deleteHandler = id => {
  console.log(id)
  setCreditor(creditor.filter(stocks => stocks.id !== id))
}

//////////////Edit//////////////////////
const editHandler = id => {
  const editItem = creditor.find(item => item.id = id)  //this serches the array to see if the object has the id and returns the object
  
  setCreditorInput({
    ...creditorInput,
    date: editItem.date,
    description: editItem.description,
    category: editItem.category,
    qty: editItem.qty,
    rate: editItem.rate,
  })
  deleteHandler(id)
} 


////////////Reducer/////////////
const reducer = (accumulator, currentValue) => {
  const returns = accumulator + Number(currentValue.total)
  return returns
}
const creditorTotal = creditor.reduce(reducer, 0)


////////////////////////////////////////dropdown//////////////
  const dropDownHandler = (event) => {
    console.log(event.target.value)
    setDescription(event.target.value)
    setIsOpen(false)
    
  }
 const dropDownCategoryHandler = (value) => {
  console.log(value, "category")
  setIsClose(false)
  setCategory(value)
 }
    /////////////Save to the backend//////
    const amount = {paid: cash, balance: totalCash, businessId : createdBy, creditorId : _id, phoneNumber, firstName, lastName, purchase: creditorTotal }
    const saveHandler = () => {
      console.log("see me, going to backend", credit, amount)
      try{
        if(credit.length === 0 ){
          return toast.error("you have not entered any new data")
        }
        if(amount.paid === undefined){
          return toast.error("You have not put in amount paid")
        }
        axios({
          method: 'post', 
          url: baseUrl2b,
          data: credit
         }).then((response) => {
          console.log(response, "credit res")
          if(response.data.code === 100){
            setSave(false)
            const id = response.data.credit.id
            console.log(id)
            const removeIt = creditor.filter((item) => item.id !== id)
            setCreditor(removeIt)
            return toast.error(response.data.message)
          }else{
            setSave(true)
          }
        })
         setCredit([])
       }catch(err){
        console.log(err.message)
        toast.error("Something went wrong while trying to save, please try again later")
      } 
    }

    if(save){
      axios({
        method: 'post', 
        url: baseUrl3,
        data: amount
       }).then((response) => {
        console.log(response)
        toast.success("Input is successfully saved at the database")
      })
      setSave(false)
    }

 const renderCreditor = creditor.map((value, id) => {
  const { date, total, description, category, qty, rate } = value;
  return (
    <>   <tr key={id} className='relative space-x-2 left-2 top-10 md:left-[230px] md:top-28 mt-2 flex md:space-x-4'>
      <td className='table-data'>{moment(date).format('DD/MM/YYYY')}</td>
      <td className='bg-gray-200 w-26 h-10 rounded pt-2 flex justify-center text-xl md:w-60'>{description}</td>
      <td className='table-header'>{category}</td>
      <td className='table-header'>{qty}</td>
      <td className='table-header'>{rate}</td>
      <td className='table-header'>{total}</td>
      </tr>
      <button className='btn7a btn7 left-3' onClick={() => deleteHandler(value.id)}>Delete</button>
      <button className='btn7a btn7 left-3' onClick={() => editHandler(value.id)}>Edit</button>
    </>
  )
 })


  return (
    <div >
      <NavBar />
      <Header pageTitle={" Creditor Page"} name={businessName + " " + fullName}/>
      {/* {JSON.stringify(creditor)} */}
      <div className='relative left-80 -top-12 font-bold text-3xl text-gray-600'>{firstName+" "+lastName}</div>
      <div className='absolute md:-left-4 top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date'className='btn4' name='date' value={creditorInput.date} onChange={onChange}/>
          
         {/*************************/}

                <div>
                    <button type='button' className='btn4' onClick={() => setIsClose(!isClose)}>
                      {category.length > 0 ? category : "Category"}
                    </button>
                    {isClose && (
                      <div className='dropContainer'>
                        {desc.map((item, index) =>(
                          <div key={index}  className='dropdown' onClick={() => dropDownCategoryHandler(item.category)}>{item.category}</div>
                        ))}
                      </div>
                    )}
                </div>
                {/*************************/}
                  {/* <Typeahead
                  className='btn6'
                  placeholder='Category'
                  onChange={(selected) => {
                    // console.log(selected)
                    setCategory(selected[0]);
                  }}
                  options={list}
                /> */}
                  {/* <input type='text' placeholder='Category' className='btn4' name='category' value={creditorInput.category} onChange={onChange}/> */}
                  
          {/********************************/}
          {/* <input type='text' placeholder='Goods Description' className='btn4' name='description' value={creditorInput.description} onChange={onChange}/> */}
          
         {/* <select className='btn4' >
               {desc.map((item, index) => (
                  // <div key={index}  className='dropdown' onClick={() => dropDownHandler(item.goods)}>{item.goods}</div>
                  <option  name='description' value={creditorInput.description} onChange={onChange}>{item.goods}</option>
                ))}
         </select> */}

        <select className='btn4' onChange={dropDownHandler}>
               {desc.map((item, index) => (
                  // <div key={index}  className='dropdown' onClick={() => dropDownHandler(item.goods)}>{item.goods}</div>
                  <option  name='description' value={item.good} >{item.goods}</option>
                ))}
         </select>

         {/* <div>
            <button className='btn4' onClick={() => setIsOpen(!isOpen)}>
              {description.length > 0 ? description : "Description"}
            </button>
            {isOpen && (
              <div className='dropContainer'>
                {desc.map((item, index) => (
                  <div key={index}  className='dropdown' onClick={() => dropDownHandler(item.goods)}>{item.goods}</div>
                ))}
              </div>
            )}
         </div> */}

          <input type='number' placeholder='Qty' className='btn4' name='qty' value={creditorInput.qty} onChange={onChange}/>
          <input type='number' placeholder='Rate N'className='btn4' name='rate' value={creditorInput.rate} onChange={onChange}/>
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-2 top-20 md:left-[230px] md:top-28 flex space-x-4'>
        <th className='table-header'>Date</th>
        <th className='bg-gray-200 w-26 text-xs md:w-60 h-10 rounded pt-2 md:text-lg'>Goods Description</th>
        <th className='table-header'>Category</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      {/* <div>{renderCreditor}</div> */}
      <div>
        {error ? error.message : renderCreditor}
      </div>

      <div className='relative float-right right-[40rem] top-40 space-y-4 shadow-xl hover:shadow w-2/5 rounded-xl'>
        <div className='flex space-x-8'><div className='btn5'>Total: </div>
        <div className='bg-gray-200 w-40 h-8 rounded pt-1 text-center text-base'>{creditorTotal}</div></div>
          <div className='flex space-x-8'>
            <div className='btn5'>Paid: </div>
                <input className='bg-gray-200 w-40 h-8 rounded pt-1 flex justify-center md:text-base text-center' value={cash} name='cash' onChange={cashHandler} placeholder='Enter cash payment'/>
                <button className='w-20 h-7 bg-gray-400 ml-2 relative left-3 top-1 rounded-md text-white font-bold text-base shadow-xl hover:shadow hover:text-black hover:bg-white' onClick={totalCashHandler}>Click</button>
          </div>
        <div className='btn5'>Bal:</div><div className='bg-gray-200 w-40 h-8 rounded pt-1 flex justify-center text-xl relative left-[7.25rem] -top-10'>{totalCash}</div>
      </div>
      <button type='submit' onClick={saveHandler} className='save'>Save</button>
      <Link to={'transaction'} state={eachCreditor}>
          <button className='save'>Check Balance</button>
      </Link>
    </div>
  )
}

export default EachCreditor
