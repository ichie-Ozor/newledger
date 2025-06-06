import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './Redux/Store';
import { AuthProvider } from './Context/auth';
import { SideBarProvider } from './Context/SideBarContext'
import './index.css';
import App from './App';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <SideBarProvider>
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </SideBarProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

