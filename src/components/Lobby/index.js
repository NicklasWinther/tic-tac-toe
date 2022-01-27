import React, { useEffect, useRef, useState } from "react";

import styles from "./styles.module.css";

function Lobby({socket, setPlayer, startHost}) {
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const nameInput = useRef(null);

  useEffect(() => {
    socket.on("GetHosts", data => {
      setRooms(data)
    })
    socket.on("NewHost", (data) => {
      setRooms(data)
    })
  });


  

	return (
		<div className={styles.container}>
			<form className={styles.input} onSubmit={(e) => e.preventDefault()}>
				<label>
					Name
					<input autoFocus ref={nameInput}/>
				</label>
        <button type="submit" onClick={() => nameInput.current.value !== "" ? startHost(nameInput.current.value) : setMessage("Enter name")}>Host</button>
        <p className={styles.error}>{message}</p>
			</form>
        <div className={styles.rooms}>
          <p>Players hosting:</p> 
          <ul >
          {
            rooms.map((lobby, index) => {
              return <li key={index} onClick={() => {socket.emit("JoinRoom", lobby.id); setPlayer("O")}}>{lobby.owner}</li>
            })
          }
          </ul>
        </div>
		</div>
	);
}

export default Lobby;
