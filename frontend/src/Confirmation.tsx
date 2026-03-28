import { useEffect, useState } from 'react'

function Confirmation() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id')

        fetch(`http://localhost:8080/checkout/session-status?session_id=${sessionId}`)
            // .then((res) => res.json)
            // .then((data) => {
            //     console.log("DATA:", data);
            //     setStatus(data.status);
            //     setCustomerEmail(data.customer_email);

            //});

            .then(res => {
                console.log("RES STATUS:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("DATA:", data);

                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            })
            .catch(err => console.error("Error:", err));

    }, []);

    if (status === 'complete') {
        return (
            <section id={"success"}>
                <p>
                    We appreciate your business! A confirmation email will be sent to {customerEmail}.

                    if you have any questions, please email email.
                </p>
            </section>
        )
    }

    return null;
}

export default Confirmation