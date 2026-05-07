import React from 'react'
import MainBanner from '../component/MainBanner'
import Categories from '../component/Categories'
import BestSeller from '../component/BestSeller'
import BottomBanner from '../component/BottomBanner'
import NewsLetter from '../component/NewsLetter'
import { useAppContext } from '../context/AppContext';
import { MessageCircle } from "lucide-react";
const Home = () => {

  const { navigate } = useAppContext();
  return (
    <div className='mt-10'>
        <MainBanner />
        <Categories />
        <BestSeller />
        <BottomBanner />
        <NewsLetter />

        <button
            onClick={() => navigate('/chatbot')}
            className="fixed  bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 animate-bounce hover:animate-none"
        >
            <MessageCircle size={24} />
        </button>
    </div>
  )
}

export default Home
