import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
//import App from './App.tsx'
import Home from './Home.tsx'
import Cart from './Cart.tsx'
import Checkout from './Checkout.tsx'
import Confirmation from "./Confirmation.tsx";
import Details from "./components/Details.tsx";
// import Navbar from "./Navbar.tsx";
import Layout from "./Layout.tsx";
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            {/*<Navbar />*/}

            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/details/:id" element={<Details />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/confirmation" element={<Confirmation />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
