import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/auth'
import { useSideBar } from '../Context/SideBarContext'


function SideBar({ children, classStyle }) {
  const { activeComponent } = useSideBar()
  console.log(activeComponent, "context here")
  const navigate = useNavigate()
  const auth = useAuth()
  const account_id = auth.user._id
  const signOutHandler = () => {
    auth.logout("myToken")
    navigate('/')
  }
  return (
    <div className="fixed w-[100%] bg-slate-500 h-[70px] top-[12vh] pl-4 md:h-screen md:bg-primary-500 md:w-[15vw] md:top-0">
      <div className='w-full md:h-fit -mt-2 md:mt-4 flex md:grid'>
        <div className='md:justify-self-center'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 -1000 960 960" fill="#ffffff"
            className=" w-[120px] h-[120px] sm:w-[54px] sm:h-[54px]">
            <path d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Zm0 0Zm0 0Z" />
          </svg>
          <span className="text-white md:text-[33px] font-bold">Ledger App</span>
        </div>
        <h6 className="italic mt-14 ml-4 md:ml-0 md:mt-2 text-[18px] md:text-[11px] text-white">...documenting your business, faster</h6>
      </div>
      <div className='text-white flex md:block md:justify-evenly mt-16'>
        <div>
          {children}
        </div>
        <div onClick={() => navigate(-1)} className='text-xs font-bold ml-3 mt-3 cursor-pointer'>BACK</div>
        {activeComponent === 'dashboard' && (
          <>
            {/* <Link to={`debtorTotal/${account_id}`} className='no-underline'><div className='text-xs font-bold ml-3 cursor-pointer text-white no-underline' >TOTAL DEBTOR STATEMENT</div></Link> */}
            {/* <Link to={`creditorTotal/${account_id}`} className='no-underline'><div className='text-xs font-bold ml-3 mt-3 cursor-pointer text-white no-underline'>TOTAL CREDITOR STATEMENT</div></Link> */}
          </>
        )}
        {activeComponent === 'eachCreditor' &&
          (<>
            <Link className='no-underline' to={'transaction'}
            // state={eachCreditor}
            >
              <button className='text-xs font-bold ml-3 mt-3 cursor-pointer text-white'>Check Balance</button>
            </Link>
          </>)
        }
        {
          activeComponent === 'eachDebtor' && (
            <>
              <Link className='no-underline' to={'transaction'}
              //  state={eachDebtor}
              >
                <button className='text-xs font-bold ml-3 mt-3 cursor-pointer text-white'>Check Balance</button>
              </Link></>
          )
        }
        <div className='text-xs font-bold ml-3 md:mt-7 mt-3 cursor-pointer' onClick={signOutHandler}>
          Sign Out
        </div>
      </div>
    </div>
  )
}

export default SideBar
