// Logo.tsx
import React from "react";
import logo from "./../../assets/images/jsir-logo.svg";

const Brand: React.FC = () => {
	return (
		<div className="logo">
			<a href="/">
				<img src={logo} alt="Jisr Logo" />
			</a>
		</div>
	);
};

export default Brand;
