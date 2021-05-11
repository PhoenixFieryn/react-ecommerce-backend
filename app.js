require('dotenv').config();
const express = require('express');

const firebaseRoutes = require('./routes/firebase.routes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use('/firebase', firebaseRoutes);

app.use((error, req, res, next) => {
	console.error(error);
	const status = error.statusCode || 500;
	const message = error.message;
	const data = error.data;
	res.status(status).json({ message: message, data: data });
});

server = app.listen(process.env.DEV_PORT || process.env.PORT || 8080);
