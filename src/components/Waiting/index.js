import React from "react";

import styles from "./styles.module.css";

function Waiting({socket}) {
	return (
		<>
			<h1 className={styles.header}>Waiting for player to join...</h1>
			<div className={styles.spinner}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</>
	);
}

export default Waiting;
