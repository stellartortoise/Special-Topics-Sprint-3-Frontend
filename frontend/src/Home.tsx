import './App.css'

function Home() {

    return (
        <>

            <div>

                <section className="hero">
                    <h1>Welcome to My Store</h1>
                    <p>Buy the best digital products, fast and secure.</p>

                    <a href="/cart" className="cta-btn">
                        View Cart
                    </a>
                </section>

                <section className="products">
                    <h2>Featured Product</h2>

                    <div className="product-card">
                        <img
                            src="/images/product.jpg"
                            alt="Video Game"
                            className="product-img"
                        />

                        <h3>Video Game</h3>
                        <p>CAD $25.00</p>

                        <a href="/checkout" className="buy-btn">
                            Buy Now
                        </a>
                    </div>
                </section>

            </div>
            );

        </>
    )
}

export default Home