import './App.css'
import {useEffect, useState} from "react";
import type {Game} from './types/Game.tsx';
import {Link} from "react-router";

function Home() {
    const [games, setGames] = useState<Game[]>([])
    const [searchTerm, setSearchTerm] = useState(""); // New state for the search bar

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/games');
            const games = await res.json();
            setGames(games);
        }

        fetchData()
    }, [])

    // Filter the games based on the search term (case-insensitive)
    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

            {/* The Search Terminal */}
            <div className="search-container">
                <input
                    type="text"
                    className="neon-search"
                    placeholder="> QUERY DATABANKS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="game-grid">
                {games.length === 0 ? (
                    <p className="loading-text">LOADING NEON GRID...</p>
                ) : filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                        <Link to={`/details/${game.id}`} key={game.id} className="game-card">
                            <h3 className="game-title">{game.name}</h3>
                            <p className="game-price">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(game.price / 100)}
                            </p>
                        </Link>
                    ))
                ) : (
                    /* Show this if they search for something that doesn't exist */
                    <p className="loading-text" style={{ color: 'var(--neon-pink)' }}>
                        NO MATCHING CARTRIDGES FOUND.
                    </p>
                )}
            </div>
        </div>
    )


}

export default Home