
import { loadStripe, type StripeEmbeddedCheckoutOptions } from '@stripe/stripe-js'
import { useCallback, useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import Cookies from "js-cookie";
import type { Cart, CartItem } from "./types/Cart.tsx";
import type { Game } from "./types/Game.tsx";

// Define the same combined type we used in the Navbar
type CartDetailItem = Game & { quantity: number };

export default function Checkout() {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
    const COOKIE_KEY = "shopping_cart";

    // State for the order summary
    const [cartDetails, setCartDetails] = useState<CartDetailItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch the full game data so we can show the tax-inclusive summary
    const loadSummaryData = async () => {
        const raw = Cookies.get(COOKIE_KEY);
        if (!raw) return;

        const cart: Cart = JSON.parse(raw);
        try {
            const fetchPromises = cart.items.map(async (item: CartItem) => {
                const res = await fetch(`http://localhost:8080/games/${item.id}`);
                const gameData = await res.json();
                return { ...gameData, quantity: item.quantity };
            });
            const details = await Promise.all(fetchPromises);
            setCartDetails(details);
        } catch (error) {
            console.error("Failed to load order summary", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSummaryData();
    }, []);

    const fetchClientSecret = useCallback(async () => {
        const cart = Cookies.get(COOKIE_KEY);
        const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: cart
        });
        const data = await res.json();
        return data.clientSecret;
    }, []);

    const options: StripeEmbeddedCheckoutOptions = { fetchClientSecret };

    // Calculations
    const subtotal = cartDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.14);
    const total = subtotal + tax;

    return (
        <div className="synthwave-container">
            <h1 className="neon-title success-title">SECURE CHECKOUT</h1>

            <div className="checkout-layout">
                {/* Left Side: The Order Summary */}
                <div className="order-summary-panel">
                    <h2 className="summary-header">ORDER MANIFEST</h2>
                    <div className="summary-list">
                        {cartDetails.map((item, index) => (
                            <div key={index} className="summary-row">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format((item.price * item.quantity) / 100)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-line">
                            <span>SUBTOTAL:</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(subtotal / 100)}</span>
                        </div>
                        <div className="summary-line">
                            <span>TAX (14%):</span>
                            <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(tax / 100)}</span>
                        </div>
                        <div className="summary-line final-total">
                            <span>TOTAL:</span>
                            <span className="neon-text-green">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'CAD' }).format(total / 100)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Stripe Form */}
                <div className="stripe-panel">
                    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                </div>
            </div>
        </div>
    );
}