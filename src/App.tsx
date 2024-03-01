import React from "react";
import "./App.css";
import FileExplorer from './components/FileExplorer/FileExplorer';
import Header from "./components/Header/Header";
import sampleData from './assets/data/sample.json';

const App: React.FC = () => {
	return (
		<div className="App Jisr-app">
			<Header></Header>
			<main>
				<FileExplorer explorerData={[sampleData]}/>
			</main>
		</div>
	);
};

export default App;
