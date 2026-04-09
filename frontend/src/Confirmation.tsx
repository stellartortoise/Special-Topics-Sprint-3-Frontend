import { useEffect, useState } from 'react'
import { Navigate, Link } from "react-router";
import Cookies from "js-cookie";

export default function Confirmation() {
    const [status, setStatus] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const COOKIE_KEY = "shopping_cart";

    // 1. Fetch the session status
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id')

        if (!sessionId) return;

        fetch(`http://localhost:8080/checkout/session-status?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            })
            .catch(err => console.error("Error:", err));
    }, []);

    // 2. Clear the cart safely ONLY when status changes to complete
    useEffect(() => {
        if (status === 'complete') {
            Cookies.remove(COOKIE_KEY);
            // Broadcast the update so the Navbar resets its counter!
            window.dispatchEvent(new Event('cartUpdated'));
        }
    }, [status]);

    if (status === 'open') {
        return <Navigate to="/checkout" />
    }

    if (status === 'complete') {
        return (
            <div className="synthwave-container flex-center">
                <div className="details-card confirmation-card">
                    <h1 className="neon-title success-title">TRANSACTION COMPLETE</h1>

                    <p className="details-description text-center">
                        DATABANKS UPDATED. A receipt has been transmitted to: <br/>
                        <span className="neon-text-cyan">{customerEmail}</span>
                    </p>

                    <p className="details-description text-center text-muted">
                        For support inquiries, ping: sysadmin@arcade.net
                    </p>

                    <div className="button-group-center">
                        <Link to="/" className="neon-button">
                            RETURN TO GRID
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="synthwave-container">
            <p className="loading-text">VERIFYING SECURE CONNECTION...</p>
        </div>
    );
}