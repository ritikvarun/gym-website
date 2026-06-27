import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Trainers from './pages/Trainers'
import Gallery from './pages/Gallery'
import Classes from './pages/Classes'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Transformations from './pages/Transformations'
import { adminDataContext } from './context/AdminContext'
import { ToastContainer } from 'react-toastify';

function App() {
  let {adminData} = useContext(adminDataContext)
  return (
    <>
      <ToastContainer />
      {!adminData ? <Login/> : 
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/trainers' element={<Trainers/>}/>
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path='/classes' element={<Classes/>}/>
          <Route path='/transformations' element={<Transformations/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      }
    </>
  )
}

export default App
