// Header.tsx
import React, { useState } from "react";
import Brand from "../Brand/Brand";
import './Header.css';

const Header: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<header className="app-header">
			<Brand />
			<nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/">About</a></li>
					<li><a href="/">Contact</a></li>
				</ul>
			</nav>
			<div className="menu-toggle" onClick={toggleMenu}>
				<div className="bar"></div>
				<div className="bar"></div>
				<div className="bar"></div>
			</div>
		</header>
	);
};

export default Header;
