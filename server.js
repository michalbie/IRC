var express = require("express");
var fs = require("fs");
var path = require("path");
var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("static"));

var pools = [];

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname + "/static/index.html"));
});

app.get("/poll", (req, res) => {
	pools.push(res);
});

app.post("/message", (req, res) => {
	let object = "";
	req.on("data", (dataChunk) => {
		object += dataChunk;
	});
	req.on("end", () => {
		res.end("Arrived");
		sendMessageToClients(object);
	});
});

const sendMessageToClients = (message) => {
	for (let i = 0; i < pools.length; i++) {
		pools[i].end(message);
	}
	pools = [];
};

app.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT);
});
