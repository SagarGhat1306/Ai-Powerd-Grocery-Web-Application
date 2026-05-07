import React,{useContext} from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AddProduct from './components/AddProduct'
import ProductList from './pages/ProductList'
import Orders from './pages/Orders'
import { AppContext } from './context/AppContext'
import AdminLogin from './components/AdminLogin'
const App = () => {

  const { user } = useContext(AppContext);
  return (
    <div className="min-h-screen bg-white">
      <Toaster />
     {!user ? (
        <AdminLogin />
      ) : (
        <>
          <Navbar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-[calc(100vh-65px)] p-4 md:p-8">
              <Routes>
                   <Route path='/add-product' element= {<AddProduct />}/>  
                   <Route path='/product-list' element= {<ProductList />}/>  
                   <Route path='/orders' element= {<Orders />}/> 
                   <Route path='/login' element= {<AdminLogin />}/>
              </Routes>  
            </main>
          </div>
        </>
      )}
    </div>
  )
}

export default App
