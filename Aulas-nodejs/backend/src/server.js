const express = require('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const path = require ('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require ('./routes.js');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://GropRoot:78951jesus@grouproot-bosup.mongodb.net/semana09?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//Trocar para o banco de dados REDIS
const connectedUsers = {};

io.on('connection', socket => {
    const {user_id} = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//GET , POST , PUT , DELETE 

// req.query = Acessar querry params (para filtros)
// req.params = Acessar route params (para edição, delete)
// req.body = Acessar corpo da requisição ( para criação, edição)

app.use(cors())

app.use(express.json());

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes);

server.listen(3333);
