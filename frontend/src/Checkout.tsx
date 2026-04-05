// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import {loadStripe, type StripeEmbeddedCheckoutOptions} from '@stripe/stripe-js'
import {useCallback} from "react";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
// import {Navigate} from "react-router";

export default function Checkout() {

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    const fetchClientSecret = useCallback(async () => {
        // Create a Checkout Session
        return await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
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

            {/*<Navigate to={"checkout"}/>*/}
        </>
    )
}
