import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import LandingPage from './Component/LandingPage';
import EmailSent from './Component/EmailSent';
import PaymentPage from './Component/PaymentPage';
import Home from './Home';
import Dashboard from './Component/Dashboard';
import AdminDashboard from './Component/AdminDashboard';
import Creditor from './Component/Main/Creditor';
import EachCreditor from './Component/Main/EachCreditor';
import EachDebtor from './Component/Main/EachDebtor';
import Sales from './Component/Main/Sales';
import Debtor from './Component/Main/Debtor';
import Stock from './Component/Main/Stock';
import CreditorTransaction from './Component/Main/CreditorTransaction';
import DebtorTransaction from './Component/Main/DebtorTransaction';
// import { useAuth } from './Context/auth';
// import axios from 'axios';

function App() {
    // const verifyUrl = 'http://localhost:8080/auth/verifyToken'
    // const auth = useAuth()

    // async function verifyToken(token) {
    //     try {
    //         let response = await fetch(verifyUrl, {
    //             method: 'GET',
    //             headers: {
    //                 Authorization: "Bearer " + token
    //             },
    //         })
    //         let data = await response.json()
    //         console.log(data, "xxxx")
    //         return data
    //     } catch (error) {
    //         console.log(error)
    //     }
    // } 
    // useEffect(()=>{
    //     const getToken = localStorage.getItem("myToken")
    //     console.log(getToken, "app")
    //     verifyToken(getToken).then((response) => {
    //         console.log(response, "app effect")
    //         auth.setUser(response.userDetail[0])
    //     })
    // },[])


  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<LandingPage />} />
            <Route path="/emailsent/:email" element={<EmailSent />} />
            <Route path="/:email?" element={<LandingPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="dashboard/creditor/:accountId" element={<Creditor />} />
            <Route path="dashboard/creditor/:accountId/:creditorId" element={<EachCreditor />} />
            <Route path="dashboard/debtor/:accountId/:debtorId" element={<EachDebtor />} />
            <Route path="dashboard/sales/:accounId" element={<Sales />} />
            <Route path="dashboard/debtor/:accountId" element={<Debtor />} />
            <Route path="dashboard/stock/:accountId" element={<Stock />} />
            <Route path="dashboard/creditor/:accountId/:creditorId/transaction" element={<CreditorTransaction />} />
            <Route path="DebtorTransaction/:creditorId" element={<DebtorTransaction />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
