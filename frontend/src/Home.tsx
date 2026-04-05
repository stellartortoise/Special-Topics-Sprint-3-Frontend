import './App.css'
import {useEffect, useState} from "react";
import type {Game} from './types/Game.tsx';

function Home() {
    const [games, setGames] = useState<Game[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/games');
            const games = await res.json();
            setGames(games);
        }

        fetchData()
    }, [])

    return (
        <>
            <h1>Home</h1>

            <p>

            </p>
        </>

    )


}

// npm install cookie or js-cookie


export default Home