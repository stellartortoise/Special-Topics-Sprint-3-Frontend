import './App.css'
import {useEffect, useState} from "react";
import type {Game} from './types/Game.tsx';
import {Link} from "react-router";

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

            {games.length > 0 && (
                games.map(game => (
                    <div key={game.id} className={"pb-3"}>
                        <Link to={`/details/${game.id}`}>
                            {game.name}
                        </Link>
                    </div>
                ))
            )}
        </>

    )


}

// npm install cookie or js-cookie


export default Home