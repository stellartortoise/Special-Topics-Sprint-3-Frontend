import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
//import App from './App.tsx'
import Home from './Home.tsx'
import Cart from './Cart.tsx'
import Checkout from './Checkout.tsx'
import Confirmation from "./Confirmation.tsx";
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
