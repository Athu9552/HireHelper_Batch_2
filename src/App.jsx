import React from 'react'
import Register from './Pages/Authentication/Register';
import Login from './Pages/Authentication/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;