import React, { useEffect, useState, useRef } from "react";
import { IoEllipseOutline, IoCloseOutline } from "react-icons/io5";
import ReactDOMServer from "react-dom/server";
import Modal from "react-modal";

import styles from "./styles.module.css";

Modal.setAppElement("#root");

function Game({ socket, move, player }) {
	const dragElement = useRef(null);
	const [modalIsOpen, setIsOpen] = useState(false);
	const [restartVotes, setRestartVotes] = useState(0);
	const [votedRestart, setVotedRestart] = useState(false);
	const [winner, setWinner] = useState(null);
	const [dragging, setDragging] = useState(null);
	const [startPieces, setStartPieces] = useState(new Array(3).fill(player));
	const [grid, setGrid] = useState([
		["", "", ""],
		["", "", ""],
		["", "", ""],
	]);
	const [isMyTurn, setIsMyTurn] = useState(player === "X" ? true : false);

	useEffect(() => {
		socket.on("Move", (newGrid) => {
			setIsMyTurn(true);
			setGrid(newGrid);
		});
		socket.on("Winner", (winner) => {
			setWinner(winner);
			setIsOpen(true);
		});
		socket.on("VoteRestart", () => {
			setRestartVotes(1);
		});
		socket.on("RestartGame", () => {
			setRestartVotes(0);
			setVotedRestart(false);
			setStartPieces(new Array(3).fill(player));
			setGrid([
				["", "", ""],
				["", "", ""],
				["", "", ""],
			]);
			setIsOpen(false);
		});
	});

	let icon = React.createElement(
		player === "X" ? IoCloseOutline : IoEllipseOutline
	);

	return (
		<>
			<Modal
				isOpen={modalIsOpen}
				className="modal"
				overlayClassName="modalOverlay"
			>
				<h1>{winner === player ? "You win!" : "You lose"}</h1>
				<div className="modalMenu">
					<button
						onClick={() => {
							if (votedRestart === false) {
								socket.emit("VoteRestart");
								if (restartVotes === 1) {
									socket.emit("RestartGame");
								} else {
									setRestartVotes((current) => current + 1);
									setVotedRestart(true);
								}
							}
						}}
					>
						Restart ({restartVotes}/2)
					</button>
					<button onClick={() => socket.emit("ExitGame")}>Exit</button>
				</div>
			</Modal>
			<h1 className={styles.turnMessage}>
				{isMyTurn ? "Your turn!" : "Opponents turn"}
			</h1>
			<div
				ref={dragElement}
				className={[styles.drag, player === "O" && styles.circle].join(" ")}
				dangerouslySetInnerHTML={{
					__html: ReactDOMServer.renderToStaticMarkup(icon),
				}}
			></div>
			<div className="start">
				{startPieces.map((p, i) => {
					return (
						<div className="cell" key={i}>
							<div
								draggable="true"
								onDragStart={(e) => {
									if (isMyTurn) {
										e.dataTransfer.setDragImage(
											dragElement.current,
											120,
											player === "O" ? 170 : 140
										);

										setDragging("Start");
									} else {
										e.preventDefault();
									}
								}}
							>
								{p === "X" ? (
									<IoCloseOutline />
								) : (
									<IoEllipseOutline className="circle" />
								)}
							</div>
						</div>
					);
				})}
			</div>
			<div className="grid">
				{grid.map((column, i) => {
					return column.map((cell, j) => {
						return (
							<div
								key={j}
								className="cell"
								onDragOver={(e) => {
									e.preventDefault();
								}}
								onDrop={(e) => {
									e.preventDefault();
									if (grid[i][j] === "") {
										let newGrid = grid;
										if (dragging === "Start") {
											newGrid[i][j] = startPieces[0];
											setStartPieces((current) =>
												current.filter((p, i) => i !== 0)
											);
										} else {
											newGrid[i][j] = grid[dragging.y][dragging.x];
											newGrid[dragging.y][dragging.x] = "";
										}
										move(grid);
										setIsMyTurn(false);
										setGrid([...newGrid]);
									}
								}}
							>
								{cell === "" ? null : cell === "X" ? (
									<div
										draggable="true"
										onDragStart={(e) => {
											if (
												isMyTurn &&
												player === "X" &&
												startPieces.length === 0
											) {
												e.dataTransfer.setDragImage(
													dragElement.current,
													120,
													player === "O" ? 170 : 140
												);
												setDragging({ x: j, y: i });
											} else {
												e.preventDefault();
											}
										}}
									>
										<IoCloseOutline />
									</div>
								) : (
									<div
										draggable="true"
										className={styles.circle}
										onDragStart={(e) => {
											if (
												isMyTurn &&
												player === "O" &&
												startPieces.length === 0
											) {
												e.dataTransfer.setDragImage(
													dragElement.current,
													120,
													player === "O" ? 170 : 140
												);
												setDragging({ x: j, y: i });
											} else {
												e.preventDefault();
											}
										}}
									>
										<IoEllipseOutline />
									</div>
								)}
							</div>
						);
					});
				})}
			</div>
		</>
	);
}

export default Game;
