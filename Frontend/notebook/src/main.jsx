import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './Component/Registration.jsx'
import Login from './Component/Login.jsx'
import Dashbord from './Component/dashboard.jsx'
import Folderview from './Component/folderview.jsx';
import Landing from './Component/landing.jsx';
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/folder/:id" element={<Folderview />} />
        
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
