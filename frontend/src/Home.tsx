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
        // <>
        //     <h1>Home</h1>
        //
        //     {games.length > 0 && (
        //         games.map(game => (
        //             <div key={game.id} className={"pb-3"}>
        //                 <Link to={`/details/${game.id}`}>
        //                     {game.name}
        //                 </Link>
        //             </div>
        //         ))
        //     )}
        // </>

        <div className="synthwave-container">
            <h1 className="neon-title">ARCADE</h1>

            <div className="game-grid">
                {games.length > 0 ? (
                    games.map(game => (
                        <div key={game.id} className="game-card">
                            <h3 className="game-title">{game.name}</h3>

                            {/* Divide by 100 and format as USD */}
                            <p className="game-price">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(game.price / 100)}
                            </p>

                            <Link to={`/details/${game.id}`} className="neon-button">
                                INSERT COIN
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="loading-text">LOADING NEON GRID...</p>
                )}
            </div>
        </div>
    )


}

export default Home