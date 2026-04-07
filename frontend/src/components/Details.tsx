import {useParams} from "react-router"; //useParams,
import type {Game} from "../types/Game.tsx";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import type {Cart, CartItem} from "../types/Cart.tsx";

export default function Details() {
    const {id} = useParams();
    const [game, setGame] = useState<Game | null>(null);
    const [showMessage, setShowMessage] = useState(false);
    const COOKIE_KEY = "shopping_cart"

    useEffect(() => {
        // if (!id) return;

        const fetchData = async() => {
            const res = await fetch('http://localhost:8080/games/' + id)
            const games = await res.json();
            setGame(games)
        }

        fetchData();
    }, [id])

    async function handleAddToCart() {
        // Code here dependancies -> js-cookie -> ^3.0.5
        const raw = Cookies.get(COOKIE_KEY);
        const cart: Cart = raw ? JSON.parse(raw) : { items: []};
        const existing = cart.items.find((item: CartItem)=> item.id === game?.id);
        const quantity = 1;

        const updatedItems = existing ? cart.items.map((item: CartItem)=>
            item.id === game?.id
                ? { ...item, quantity: item.quantity + quantity}
                : item
        )
        : [...cart.items, { id: game?.id, quantity}]

        //
        // const rawJson = Cookies.get("shopping_cart")
        //
        // console.log(rawJson);
        //
        // const cart = rawJson ? JSON.parse(rawJson) : { items: [] }
        Cookies.set(COOKIE_KEY, JSON.stringify({ items: updatedItems }), { expires: 1});

        setShowMessage(true);
    }

    console.log(id)

    if (!game) {
        return <h1>No Details</h1>;
    }

    return (
        <>
            {
                showMessage && (
                    <p className="text-success">
                        Item added to cart successfully
                    </p>
                )
            }

            {
                game && (
                    <div>
                        <p>{game.name}</p>
                        <p>{game.description}</p>
                        <p>{game.price}</p>
                        <p>
                            <button className="btn btn-primary" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </p>
                    </div>
                )
            }
        </>
    )
}