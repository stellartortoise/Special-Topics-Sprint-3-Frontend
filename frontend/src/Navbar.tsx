import { useEffect, useState } from "react";
import { Link } from "react-router";
import Cookies from "js-cookie";
import type { Cart, CartItem } from "./types/Cart.tsx";
import type { Game } from "./types/Game.tsx";

type CartDetailItem = Game & { quantity: number };

const getInitialCartCount = () => {
    const raw = Cookies.get("shopping_cart");
    if (raw) {
        const cart: Cart = JSON.parse(raw);
        return cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    }
    return 0;
};

export default function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartCount, setCartCount] = useState(getInitialCartCount);
    const [cartDetails, setCartDetails] = useState<CartDetailItem[]>([]);
    const [isDecrypting, setIsDecrypting] = useState(false);

    const loadCartData = async () => {
        const raw = Cookies.get("shopping_cart");
        if (!raw) {
            setCartCount(0);
            setCartDetails([]);
            return;
        }

        const cart: Cart = JSON.parse(raw);
        const total = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
        setCartCount(total);

        setIsDecrypting(true);
        try {
            const fetchPromises = cart.items.map(async (item: CartItem) => {
                const res = await fetch(`http://localhost:8080/games/${item.id}`);
                const gameData = await res.json();
                return { ...gameData, quantity: item.quantity };
            });

            const details = await Promise.all(fetchPromises);
            setCartDetails(details);
        } catch (error) {
            console.error("Databank decryption failed:", error);
        } finally {
            setIsDecrypting(false);
        }
    };

    useEffect(() => {
        loadCartData();

        const handleCartUpdate = () => {
            loadCartData();
            setIsCartOpen(true);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const handleClearCart = () => {
        Cookies.remove("shopping_cart");
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // --- NEW TAX CALCULATIONS ---
    const cartSubtotal = cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTax = Math.round(cartSubtotal * 0.14); // 14% Tax, rounded to the nearest cent
    const cartTotal = cartSubtotal + cartTax;

    return (
        <>
            <nav className="synth-navbar">
                <Link to="/" className="nav-logo">LOST CARTRIDGE</Link>
                <button className="neon-button cart-btn" onClick={() => setIsCartOpen(true)}>
                    CART [{cartCount}]
                </button>
            </nav>

            {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>}

            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>DATABANK</h2>
                    <button className="close-btn" onClick={() => setIsCartOpen(false)}>X</button>
                </div>

                <div className="cart-content">
                    {cartCount > 0 ? (
                        isDecrypting ? (
                            <div className="cart-items-placeholder">
                                <p className="neon-text-cyan">{cartCount} CARTRIDGE(S) DETECTED</p>
                                <p className="text-muted blink-text">Decrypting databanks...</p>
                            </div>
                        ) : (
                            <div className="cart-item-list">
                                {cartDetails.map((item, index) => (
                                    <div key={index} className="cart-item-row">
                                        <div className="cart-item-info">
                                            <span className="cart-item-title">{item.name}</span>
                                            <span className="cart-item-qty">QTY: {item.quantity}</span>
                                        </div>
                                        <span className="cart-item-price">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency', currency: 'CAD'
                                            }).format((item.price * item.quantity) / 100)}
                                        </span>
                                    </div>
                                ))}

                                {/* --- NEW RECEIPT BREAKDOWN --- */}
                                <div className="cart-summary">
                                    <div className="cart-summary-row">
                                        <span>SUBTOTAL:</span>
                                        <span>
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(cartSubtotal / 100)}
                                        </span>
                                    </div>
                                    <div className="cart-summary-row">
                                        <span>TAX (14%):</span>
                                        <span>
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(cartTax / 100)}
                                        </span>
                                    </div>
                                    <div className="cart-total-row">
                                        <span>TOTAL:</span>
                                        <span className="neon-text-green">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(cartTotal / 100)}
                                        </span>
                                    </div>
                                </div>

                            </div>
                        )
                    ) : (
                        <p className="neon-text-pink">NO DATA FOUND</p>
                    )}
                </div>

                {cartCount > 0 && (
                    <div className="cart-footer">
                        <Link to="/checkout" className="neon-button checkout-btn" onClick={() => setIsCartOpen(false)}>
                            INITIATE CHECKOUT
                        </Link>

                        <button className="neon-button danger-btn clear-cart-btn" onClick={handleClearCart}>
                            PURGE DATABANK
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}