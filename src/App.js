import Dashboard from './Component/Dashboard';
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import LandingPage from './Component/LandingPage';
import Creditor from './Component/Main/Creditor'
import Sales from './Component/Main/Sales'
import Debtor from './Component/Main/Debtor'
import Stock from './Component/Main/Stock'
import './App.css';
import AdminDashboard from './Component/AdminDashboard';
import EachCreditor from './Component/Main/EachCreditor';
import EachDebtor from './Component/Main/EachDebtor'
import CreditorTransaction from './Component/Main/CreditorTransaction';
import DebtorTransaction from './Component/Main/DebtorTransaction';
import PaymentPage from './Component/PaymentPage';



const router = createBrowserRouter(
  createRoutesFromElements(
      <Route>
        <Route 
            path='/' 
            element={<LandingPage />}/>
        <Route 
            path='payment' 
            element={<PaymentPage />}/>
        <Route 
            path='dashboard' 
            element={<Dashboard />}/>
        <Route 
            path='admin' 
            element={<AdminDashboard />}/>
        <Route 
            path='dashboard/creditor/:accountId' 
            element={<Creditor />} />
        <Route 
            path='dashboard/creditor/:accountId/:creditorId' 
            element={<EachCreditor />} />
        <Route 
            path='dashboard/debtor/:accountId/:debtorId' 
            element={<EachDebtor />} />
        <Route 
            path='dashboard/sales/:accounId' 
            element={<Sales />} />
        <Route 
            path='dashboard/debtor/:accountId' 
            element={<Debtor />} />
        <Route 
            path='dashboard/stock/:accountId' 
            element={<Stock />} />
        <Route 
            path='dashboard/creditor/:accountId/:creditorId/transaction' 
            element={<CreditorTransaction />} />
        {/* <Route 
            path='dashboard/creditorTransaction/:accountId/:creditorId' 
            element={<CreditorTransaction />} /> */}
        {/* <Route
            path="transactionSummary"
            element={<Navigate to="dashboard/creditorTransaction/:accountId/:creditorId" />} /> */}
        <Route 
            path='DebtorTransaction/:creditorId' 
            element={<DebtorTransaction />} />
      </Route>
  )
)
function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;








