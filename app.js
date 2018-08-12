const express = require("express");
const app = express();
const path = require("path");

app.get("/", (req, res) =>
	res.sendFile(path.join(__dirname, "client/dist/index.html"))
);

app.use(express.static(path.join(__dirname, 'client/dist')));
app.listen(3000, ()=> console.log("Server started"));
