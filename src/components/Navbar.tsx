import { useEffect, useState } from "react";
import "./Navbar.css";

function Navbar() {
    const [animate, setAnimate] = useState(true); 

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimate(true);
            setTimeout(() => setAnimate(false), 1000); 
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-left">
                <h1 className={`brand ${animate ? "animate" : ""}`}>ChatterBox</h1>
            </div>
            <div className="nav-right">
                <ul className="nav-links">
                    <li><a href="#" className="active">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
