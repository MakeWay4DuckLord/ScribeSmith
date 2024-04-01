const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const APIRouter = require('./db/routes');
app.use( APIRouter);


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));