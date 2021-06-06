const poll = async () => {
	console.log("poll");
	const response = await fetch("/poll", { method: "GET" });
	if (!response.ok) {
		poll();
	} else {
		const resp = await response.json();
		const author = resp.author;
		const message = resp.message;
		const authorColor = resp.color;
		addMessage(message, author, authorColor);
		poll();
	}
};

const sendMessage = async (message, nickname, color) => {
	console.log("msg");
	document.getElementById("input-message").focus();

	const response = await fetch("/message", {
		method: "POST",
		body: JSON.stringify({
			message: message,
			author: nickname,
			color: color,
		}),
	});

	if (!response.ok) {
		console.log("Error occured");
	} else {
		const resp = await response.text();
	}
};

const addMessage = (message, author, authorColor) => {
	var messageWrapperTemplate = document.getElementsByTagName("template")[0];
	var authorText = `<pre><p style="color: #${authorColor}; display:inline">${author}</p>: </pre>`;
	var messageText = `${message}`;
	messageWrapperTemplate.content.querySelector(".author-message-wrapper").querySelector(".author-wrapper").innerHTML = authorText;
	messageWrapperTemplate.content.querySelector(".author-message-wrapper").querySelector(".message-text-wrapper").innerHTML = messageText;

	var current = new Date();
	messageWrapperTemplate.content.querySelector(".message-timestamp").innerHTML = `${current.getHours()}:${current
		.getMinutes()
		.toString()
		.padStart(2, "0")}`;

	var messageWrapper = messageWrapperTemplate.content.cloneNode(true);
	document.getElementById("messages-area").appendChild(messageWrapper);
	messagesAreaScrollbar.update();

	$(".message-text-wrapper").emoticonize();
};

const handleCommand = (command) => {
	switch (command) {
		case "/color":
			color = Math.floor(Math.random() * 16777215).toString(16);
			sendMessage(`${nickname} changed color to #${color}.`, "SERVER", "ff0000");
			break;
		case "/nick":
			let oldNickname = nickname;
			nickname = prompt("Enter new nick");
			sendMessage(`${oldNickname} changed nickname to "${nickname}".`, "SERVER", "ff0000");
			break;
		case "/refresh":
			open(location, "_self").close();
			break;
	}
};

const handleInput = (message) => {
	if (message == "/color" || message == "/nick" || message == "/refresh") {
		handleCommand(message);
		document.getElementById("input-message").value = "";
		return;
	} else {
		sendMessage(message, nickname, color);
		document.getElementById("input-message").value = "";
	}
};

document.getElementById("send-button").onclick = () => {
	const message = document.getElementById("input-message").value;
	handleInput(message);
};

document.getElementById("input-message").addEventListener("keypress", (event) => {
	const message = document.getElementById("input-message").value;
	if (event.key == "Enter") {
		handleInput(message);
	}
});

let nickname = prompt("Enter your nickname: ");
let color = Math.floor(Math.random() * 16777215).toString(16);

const messagesArea = document.querySelector("#messages-area");
const messagesAreaScrollbar = new PerfectScrollbar(messagesArea);

poll();
