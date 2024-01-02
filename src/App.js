import Dashboard from './Component/Dashboard';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LandingPage from './Component/LandingPage';
import Creditor from './Component/Main/Creditor'
import Sales from './Component/Main/Sales'
import Debtor from './Component/Main/Debtor'
import Stock from './Component/Main/Stock'
import './App.css';
import AdminDashboard from './Component/AdminDashboard';



const router = createBrowserRouter(
  createRoutesFromElements(
      <Route>
        <Route path='/' element={<LandingPage />}/>
        <Route path='dashboard' element={<Dashboard />}/>
        <Route path='admin' element={<AdminDashboard />}/>
        <Route path='dashboard/creditor' element={<Creditor />} />
        <Route path='dashboard/sales' element={<Sales />} />
        <Route path='dashboard/debtor' element={<Debtor />} />
        <Route path='dashboard/stock' element={<Stock />} />
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








