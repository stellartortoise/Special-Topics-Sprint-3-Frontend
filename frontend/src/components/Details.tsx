import {useParams, useSearchParams} from "react-router";
import type {Game} from "../types/Game.tsx";
import {useEffect, useState} from "react";

export default function Details() {
    // let [searchParams] = useSearchParams();

    const {id} = useParams; // searchParams.get("id");
    const [game, setGame] = useState<Game>(null);

    useEffect(() => {
        const fetchData = async() => {
            const res = await fetch('http://localhost:8080/games/')
            const games = await res.json();
            setGame(games)
        }

        fetchData();
    })

    async function handleAddToCart() {
        // Code here dependancies -> js-cookie -> ^3.0.5
        // const rawJson = Cookies.get("shopping_cart"

        // console.log(rawJson);

        // const cart = rawJson ? JSON.parse(rawJson) : { items: [] }
        // Cookies.set()
    }

    return (
        <>
            <h1>Details</h1>

            {
                game && (
                    <div>
                        <p>{game.title}</p>
                        <p>{game.synopsis}</p>
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