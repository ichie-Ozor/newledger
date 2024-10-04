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
  const [sale, setSale] = useState([])
  const [error, setError] = useState("")
  const [isOpen, setIsOpen] = useState(false) //// goods category dropdown
  const [isClose, setIsClose] = useState(false)  /// goods description
  const [category, setCategory] = useState([])  ///category
  // const [save, setSave] = useState(false)
  const [description, setDescription] = useState([])
  const [lists, setLists] = useState([]) ///category
  const auth = useAuth()
  const [salesInput, setSalesInput] = useState({
    date: "",
    description: "",
    category: "",
    qty: "",
    rate: ""
  })

  /////////This loads the sales data once the page opens
  const account_id = auth.user._id
  const salesUrlxx = baseUrl + "/sales/"
  const salesUrl = baseUrl + `/sales/${account_id}`
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
    if (salesInput.date === "" && salesInput.category === "" && salesInput.description === "" && salesInput.qty === "" && salesInput.rate === "") return toast.error("please enter the items")
    if (lists.length === 0) {
      return toast.error("please enter the goods inthe stock first, Thank you")
    }
    const account_id = auth.user._id
    //this is displayed on the frontend
    setSales((prev) => [
      ...prev,
      {
        id: new Date().getMilliseconds(),
        account: account_id,
        date: salesInput.date,
        description: description,
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
        description: description,
        category: category,
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
      qty: "",
      rate: ""
    })
    setCategory('')
    setDescription('')
  }


  ///////// it should also send data to the backend from here and display it on the page at the same time
  // const saveHandler = async() => {
  async function saveHandler() {
    let finished = window.confirm("Have you entered all the sales?")
    if (finished) {
      try {
        await axios({
          method: 'post',
          url: salesUrlxx,
          data: sale
        }).then(() => {
          toast.success("Sales Posted Successfully")
        }).catch((error) => {
          toast.error(error.response.data.message || "Something went wrong, try again later!")
        })
      } catch (err) {
        console.log(err, "error")
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

  // if(save){
  //   saveHandler()
  //   setSave(false)
  // }
  /////////////Dropdown///////////
  const dropDownDescHandler = (value) => {
    // if(!isOpen){
    //   setIsOpen(false)
    // }
    setIsClose(false)
    setDescription(value)
  }
  const dropDownHandler = (value) => {
    // e.preventDefault()
    // if(!isClose){
    //   setIsClose(false)
    // }
    setIsOpen(false)
    setCategory(value)
  }
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
  const salesTotal = sales.reduce(reducer, 0)


  const renderSales = sales.map((value, id) => {
    const { total, date, description, category, qty, rate } = value;
    return (
      <>
        <tr key={id} className='relative top-20 left-2 md:left-60 md:top-28 mt-2 flex space-x-1 md:space-x-4  w-[110vw]'>
          <td className='table-header'>{moment(date).format('DD/MM/YYYY')}</td>
          <td className='table-header'>{category}</td>
          <td className='bg-gray-200 w-40 md:w-60 h-10 rounded pt-2 flex justify-center text-xs md:text-xl'>{description}</td>
          <td className='table-header'>{qty}</td>
          <td className='table-header'>{rate}</td>
          <td className='table-header'>{total}</td>
        </tr>
        <button className='btn7  relative top-12 md:top-20 left-[111%] md:left-[85.2%]' onClick={() => deleteHandler(value)}>Delete</button>
        {/* <button className='btn7  relative top-12 md:top-20 left-[111%] md:left-[85.2%]' onClick={() => editHandler(value.id)}>Edit</button> */}
      </>
    )
  })

  return (
    <div>
      <NavBar classStyle='fixed grid w-[146vw] bg-slate-500 h-[50px] top-24 md:h-screen md:bg-primary-500 md:w-48 md:top-0 md:justify-items-center'>
        {/* <div className='absolute top-[1rem] text-xs font-bold left-[0.767rem] cursor-pointer' onClick={() => navigate(-1)} >BACK</div> */}
      </NavBar>
      <Header pageTitle={" Sales Page"} name={businessName + " " + fullName} classStyle='bg-primary-200 h-36 w-[146vw] md:w-[100vw] flex' />
      <div className='absolute left top-22 '>
        <form className='relative flex  left-56' onSubmit={submitHandler}>
          <input type='date' placeholder='date' className='btn4' name='date' value={salesInput.date} onChange={onChange} />
          <div>
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
          </div>
          <input type='number' placeholder='Qty' className='btn4' name='qty' value={salesInput.qty} onChange={onChange} />
          <input type='number' placeholder='Rate N' className='btn4' name='rate' value={salesInput.rate} onChange={onChange} />
          <button type='submit' className='submit'>Submit</button>
        </form>
      </div>
      <table className='relative left-2 top-20 space-x-1 md:left-60 md:top-28 flex md:space-x-4  w-[110vw]'>
        <th className='flex text-center justify-center bg-gray-200 w-[6rem] md:w-[9.7rem] h-10 rounded pl-6 pr-6 pt-2 text-xs md:text-lg'>Date</th>
        <th className='table-header'>Category</th>
        <th className='text-xs bg-gray-200 w-28 md:w-60 text-center h-10 rounded pt-2 md:text-lg'>Sales Description</th>
        <th className='table-header'>Quantity</th>
        <th className='table-header'>Rate</th>
        <th className='table-header'>Total</th>
      </table>
      {error}
      <div>{renderSales}</div>
      <div className='relative w-[20.5rem] h-28 items-center justify-center pt-10 md:left-[25rem] left-[1.5rem] top-28 md:top-40 space-y-8 shadow-xl hover:shadow md:w-[27rem] rounded-xl'>
        <div className='flex space-x-8  mb-6'><div className='btn5'>Total : </div>
          <div className='bg-gray-200 w-[12rem] md:w-72 h-10 rounded pt-2 text-center text-xl'>{salesTotal}</div>
        </div>
      </div>
      <button className={sales.length === 0 ? 'unsave' : 'save'} onClick={saveHandler} disabled={sales.length === 0}>Save</button>
    </div>
  )
}

export default Sales
