import { Outlet } from "react-router";
import Navbar from "./Navbar";
import ChatWidget from "./components/ChatWidget.tsx";

export default function Layout() {
    return (
        <>
            <Navbar />

            <main>
                <Outlet />
            </main>

            <ChatWidget />
        </>
    );
}