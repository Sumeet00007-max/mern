import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux';
import { store } from './store/store.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

    <BrowserRouter>
      <App />
      <ToastContainer 
        position="bottom-left"
        autoClose={4000}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
    </BrowserRouter>
        </Provider>
  </StrictMode>,
)
