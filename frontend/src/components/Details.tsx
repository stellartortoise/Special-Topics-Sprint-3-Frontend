// import {useParams} from "react-router"; //useParams,
// import type {Game} from "../types/Game.tsx";
// import {useEffect, useState} from "react";
// import Cookies from "js-cookie";
// import type {Cart, CartItem} from "../types/Cart.tsx";
//
// export default function Details() {
//     const {id} = useParams();
//     const [game, setGame] = useState<Game | null>(null);
//     const [showMessage, setShowMessage] = useState(false);
//     const COOKIE_KEY = "shopping_cart"
//
//     useEffect(() => {
//         // if (!id) return;
//
//         const fetchData = async() => {
//             const res = await fetch('http://localhost:8080/games/' + id)
//             const games = await res.json();
//             setGame(games)
//         }
//
//         fetchData();
//     }, [id])
//
//     async function handleAddToCart() {
//         // Code here dependancies -> js-cookie -> ^3.0.5
//         const raw = Cookies.get(COOKIE_KEY);
//         const cart: Cart = raw ? JSON.parse(raw) : { items: []};
//         const existing = cart.items.find((item: CartItem)=> item.id === game?.id);
//         const quantity = 1;
//
//         const updatedItems = existing ? cart.items.map((item: CartItem)=>
//             item.id === game?.id
//                 ? { ...item, quantity: item.quantity + quantity}
//                 : item
//         )
//         : [...cart.items, { id: game?.id, quantity}]
//
//         //
//         // const rawJson = Cookies.get("shopping_cart")
//         //
//         // console.log(rawJson);
//         //
//         // const cart = rawJson ? JSON.parse(rawJson) : { items: [] }
//         Cookies.set(COOKIE_KEY, JSON.stringify({ items: updatedItems }), { expires: 1});
//
//         setShowMessage(true);
//     }
//
//     console.log(id)
//
//     if (!game) {
//         return <h1>No Details</h1>;
//     }
//
//     return (
//         <>
//             {
//                 showMessage && (
//                     <p className="text-success">
//                         Item added to cart successfully
//                     </p>
//                 )
//             }
//
//             {
//                 game && (
//                     <div>
//                         <p>{game.name}</p>
//                         <p>{game.description}</p>
//                         <p>{game.price}</p>
//                         <p>
//                             <button className="btn btn-primary" onClick={handleAddToCart}>
//                                 Add to Cart
//                             </button>
//                         </p>
//                     </div>
//                 )
//             }
//         </>
//     )
// }

import { useParams, Link } from "react-router";
import type { Game } from "../types/Game.tsx";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { Cart, CartItem } from "../types/Cart.tsx";

export default function Details() {
    const { id } = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const COOKIE_KEY = "shopping_cart";

    useEffect(() => {
        const fetchData = async() => {
            try {
                const res = await fetch('http://localhost:8080/games/' + id);
                const data = await res.json();
                setGame(data);
            } catch (error) {
                console.error("Error fetching details", error);
            }
        }

        fetchData();
    }, [id])

    async function handleAddToCart() {
        const raw = Cookies.get(COOKIE_KEY);
        const cart: Cart = raw ? JSON.parse(raw) : { items: [] };
        const existing = cart.items.find((item: CartItem) => item.id === game?.id);
        const quantity = 1;

        const updatedItems = existing ? cart.items.map((item: CartItem) =>
            item.id === game?.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
        ) : [...cart.items, { id: game?.id, quantity }];

        Cookies.set(COOKIE_KEY, JSON.stringify({ items: updatedItems }), { expires: 1 });

        // Show the neon success message, then hide it after 3 seconds
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    }

    if (!game) {
        return (
            <div className="synthwave-container">
                <p className="loading-text">DECRYPTING DATA...</p>
            </div>
        );
    }

    return (
        <div className="synthwave-container">
            {/* The Back Button */}
            <div className="nav-bar">
                <Link to="/" className="neon-back-btn">
                    &lt; RETURN TO ARCADE
                </Link>
            </div>

            {/* Success Message */}
            {showMessage && (
                <div className="neon-success-message">
                    CARTRIDGE ACQUIRED!
                </div>
            )}

            {/* Details Card Layout */}
            <div className="details-card">
                <div className="details-image-container">
                    {/* Fallback to a glowing box if the image URL is broken or empty */}
                    {game.image ? (
                        <img src={game.image} alt={game.name} className="game-image" />
                    ) : (
                        <div className="game-image-placeholder">NO IMAGE DATA</div>
                    )}
                </div>

                <div className="details-info-container">
                    <h1 className="details-title">{game.name}</h1>

                    <p className="game-price details-price">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(game.price / 100)}
                    </p>

                    <div className="details-meta">
                        <p><span>DEVELOPER:</span> {game.developer}</p>
                        <p><span>PLATFORM:</span> {game.platform}</p>
                        <p><span>CATEGORY:</span> {game.category}</p>
                        <p><span>RATING:</span> {game.esrbRating}</p>
                    </div>

                    <div className="details-description">
                        <p>{game.description}</p>
                    </div>

                    <button className="neon-button add-cart-btn" onClick={handleAddToCart}>
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    );
}