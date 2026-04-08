import { useEffect, useState } from "react";
import { Link } from "react-router";
import Cookies from "js-cookie";
import type { Cart, CartItem } from "./types/Cart.tsx";

const getInitialCartCount = () => {
    const raw = Cookies.get("shopping_cart");
    if (raw) {
        const cart: Cart = JSON.parse(raw);
        // Swap 'any' for 'CartItem' right here:
        return cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    }
    return 0;
};

export default function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(getInitialCartCount);

    // Helper function to read the cookie and tally the total items
    // const loadCartCount = () => {
    //     const raw = Cookies.get("shopping_cart");
    //     if (raw) {
    //         const cart: Cart = JSON.parse(raw);
    //         const total = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    //         setCartCount(total);
    //     }
    // };

    useEffect(() => {

        // Listen for the custom event we added to Details.tsx
        const handleCartUpdate = () => {
            // It is perfectly fine to call setState inside an event listener callback
            setCartCount(getInitialCartCount());
            setIsCartOpen(true);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);

        // Cleanup listener on unmount
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    return (
        <>
            {/* The Top Navigation Bar */}
            <nav className="synth-navbar">
                <Link to="/" className="nav-logo">ARCADE</Link>
                <button className="neon-button cart-btn" onClick={() => setIsCartOpen(true)}>
                    CART [{cartCount}]
                </button>
            </nav>

            {/* Darkens the background when the cart is open */}
            {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}

            {/* The Sliding Side-Cart */}
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>DATABANK</h2>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>X</button>
                </div>

                <div className="cart-content">
                    {cartCount > 0 ? (
                        <div className="cart-items-placeholder">
                            <p className="neon-text-cyan">{cartCount} CARTRIDGE(S) DETECTED</p>
                            <p className="text-muted">Awaiting decryption sequence...</p>
                        </div>
                    ) : (
                        <p className="neon-text-pink">NO DATA FOUND</p>
                    )}
                </div>

                {/* Only show the checkout button if they have items */}
                {cartCount > 0 && (
                    <div className="cart-footer">
                        <Link to="/checkout" className="neon-button checkout-btn" onClick={() => setIsCartOpen(false)}>
                            INITIATE CHECKOUT
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}