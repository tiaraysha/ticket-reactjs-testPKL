import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    < RouterProvider router={router} />
  </StrictMode>,
)
