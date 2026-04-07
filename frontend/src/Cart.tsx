import {Link} from "react-router";

function Cart() {

    return (
        <>
            <h1>Cart</h1>

            <p>
                <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link>
            </p>

        </>
    )
}

export default Cart