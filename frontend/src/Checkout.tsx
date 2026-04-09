
import {loadStripe, type StripeEmbeddedCheckoutOptions} from '@stripe/stripe-js'
import {useCallback} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import Cookies from "js-cookie";


export default function Checkout() {

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    const COOKIE_KEY = "shopping_cart";

    const fetchClientSecret = useCallback(async () => {

        // Get shopping cart from cookie

        const cart = Cookies.get(COOKIE_KEY)

        // Create a Checkout Session
        return await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: cart
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    }, []);

    const options:StripeEmbeddedCheckoutOptions = {fetchClientSecret};

    return (
        <>
            <div id="checkout">
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={options}
                >
                    <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
            </div>

        </>
    )
}
