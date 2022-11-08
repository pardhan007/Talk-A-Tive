import React from "react";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Homepage from "./Pages/Homepage";
import "./App.css";

const App = () => {
	return (
		<div className="App">
			<Route exact path="/" component={Homepage} />
			<Route exact path="/chats" component={Chatpage} />
		</div>
	);
};

export default App;
