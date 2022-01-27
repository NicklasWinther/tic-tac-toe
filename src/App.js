import "./App.css";
import socketIOClient from "socket.io-client";
import { useEffect, useState } from "react";
import Lobby from "./components/Lobby";
import Game from "./components/Game";
import Waiting from "./components/Waiting";


const socket = socketIOClient("10.205.80.32:3001");

function App() {
	const [gameState, setGameState] = useState(0);
	const [player, setPlayer] = useState(null)

	useEffect(() => {
		socket.on("StartGame",() => {
			setGameState(2)

		})
		socket.on("PlayerLeft", () => {
			setGameState(0)
		})
	}, []);

	const startHost = (name) => {
		setPlayer("X")
		setGameState(1)
		socket.emit("StartHost", name);
	}

	const move = (grid) => {
		socket.emit("Move", grid);
	};

	return (
		<div className="App">
			{gameState===0 ? <Lobby setGameState={setGameState} startHost={startHost} setPlayer={setPlayer} socket={socket}/> : (gameState === 1 ? <Waiting socket={socket}/> : <Game socket={socket} player={player} move={(grid) => move(grid)} />)}
		</div>
	);
}

export default App;
