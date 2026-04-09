import './App.css'
import { useEffect, useState } from "react";
import type { Game } from './types/Game.tsx';
import { Link } from "react-router";

export default function Home() {
    const [games, setGames] = useState<Game[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [platformFilter, setPlatformFilter] = useState("All");
    const [esrbFilter, setEsrbFilter] = useState("All");

    // NEW: State to hold the featured game
    const [suggestedGame, setSuggestedGame] = useState<Game | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:8080/games');
            const data = await res.json();
            setGames(data);

            // NEW: Pick a random game to feature when the page loads
            if (data && data.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.length);
                setSuggestedGame(data[randomIndex]);
            }
        }
        fetchData()
    }, [])

    const filteredGames = games.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlatform = platformFilter === "All" || game.platform === platformFilter;
        const matchesEsrb = esrbFilter === "All" || game.esrbRating === esrbFilter;
        return matchesSearch && matchesPlatform && matchesEsrb;
    });

    // Check if the user is actively searching so we know whether to hide the hero sections
    const isFiltering = searchTerm !== "" || platformFilter !== "All" || esrbFilter !== "All";

    const platforms = ["All", ...new Set(games.map(g => g.platform))];
    const ratings = ["All", ...new Set(games.map(g => g.esrbRating))];

    return (
        <div className="synthwave-container">
            {/* The Control Terminal */}
            <div className="filter-terminal">
                <input
                    type="text"
                    className="neon-search"
                    placeholder="> SEARCH TITLES..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-group">
                    <select className="neon-select" value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
                        {platforms.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                    </select>
                    <select className="neon-select" value={esrbFilter} onChange={(e) => setEsrbFilter(e.target.value)}>
                        {ratings.map(r => <option key={r} value={r}>ESRB: {r}</option>)}
                    </select>
                </div>
            </div>

            {/* NEW: Welcome Message (Hides when searching) */}
            {!isFiltering && (
                <div className="welcome-section">
                    <h2 className="welcome-title">WELCOME TO THE LOST CARTRIDGE ARCADE</h2>
                    <p className="welcome-subtitle">Browse the databanks, select your titles, and prepare to initialize.</p>
                </div>
            )}

            {/* NEW: Suggested Game Card (Hides when searching) */}
            {!isFiltering && suggestedGame && (
                <div className="suggested-section">
                    <Link to={`/details/${suggestedGame.id}`} className="suggested-card">

                        <div className="suggested-badge">
                            ★ SUGGESTED TITLE ★
                        </div>

                        <div className="suggested-content">
                            <div className="suggested-image-container">
                                {suggestedGame.image ? (
                                    <img src={suggestedGame.image} alt={suggestedGame.name} className="suggested-image" />
                                ) : (
                                    <div className="game-image-placeholder">NO IMAGE</div>
                                )}
                            </div>

                            <div className="suggested-info">
                                <h3 className="suggested-title">{suggestedGame.name}</h3>
                                <p className="game-price suggested-price">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(suggestedGame.price / 100)}
                                </p>
                                <p className="suggested-desc">
                                    {/* Truncate the description so it doesn't break the card size */}
                                    {suggestedGame.description.length > 150
                                        ? suggestedGame.description.substring(0, 150) + "..."
                                        : suggestedGame.description}
                                </p>
                                <div className="suggested-meta">
                                    <span>[ {suggestedGame.platform} ]</span>
                                    <span>[ ESRB: {suggestedGame.esrbRating} ]</span>
                                </div>
                            </div>
                        </div>

                    </Link>
                </div>
            )}

            {/* The Standard Game Grid */}
            <div className="game-grid">
                {games.length === 0 ? (
                    <p className="loading-text">LOADING NEON GRID...</p>
                ) : filteredGames.length > 0 ? (
                    filteredGames.map(game => (
                        <Link to={`/details/${game.id}`} key={game.id} className="game-card">
                            <h3 className="game-title">{game.name}</h3>
                            <p className="game-price">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(game.price / 100)}
                            </p>
                        </Link>
                    ))
                ) : (
                    <p className="loading-text" style={{ color: 'var(--neon-pink)' }}>
                        NO MATCHING CARTRIDGES IN THIS SECTOR.
                    </p>
                )}
            </div>
        </div>
    )
}