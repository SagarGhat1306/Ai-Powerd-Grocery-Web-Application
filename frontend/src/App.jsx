import React, { useContext } from 'react'
import Navbar from './component/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './component/Footer'
import { useAppContext } from './context/AppContext'
import Login from './component/Login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import AddAddress from './pages/AddAddress'
import OrderPage from './pages/OrderPage'
import ChatBot from './component/ChatBot'
const App = () => {

  const isSellerPath  = useLocation().pathname.includes("seller")
  const {showuserLogin} =  useAppContext ();

  return (
    <div>
      {isSellerPath ? null : <Navbar /> }
      {showuserLogin ? <Login /> : null}
      <Toaster />
      <div className={`${isSellerPath ? ""  : " px-6 md:px-16 lg:px-25 xl:px-32"}`}>
        <Routes>  
          <Route path='/' element= {<Home />}/>a
          <Route path='/products' element= {<AllProducts />}/> 
          <Route path='/products/:category' element= {<ProductCategory />}/>  
          <Route path='/products/:category/:id' element= {<ProductDetail />}/> 
          <Route path='/cart' element= {< CartPage />}/> 
          <Route path='/address' element= {<AddAddress />}/> 
          <Route path='/my-orders' element= {<OrderPage/>}/>  
          <Route path='/chatbot' element= {<ChatBot/>}/> 
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  )
}

export default App
