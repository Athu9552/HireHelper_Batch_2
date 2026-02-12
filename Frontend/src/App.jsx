import React from 'react'
import Register from './Pages/Authentication/Register';
import Login from './Pages/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard/Dashboard';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;