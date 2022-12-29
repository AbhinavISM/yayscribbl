const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 4000;

// bad line causes error in websocket connection
// var server = http.createServer(app);

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('server started and running at port' + PORT);
});

const mongoose = require("mongoose");
const io = require("socket.io")(server)

const db = 'mongodb+srv://Abhinavkism:TMecPvft6v9rf9B8@cluster0.akleghw.mongodb.net/?retryWrites=true&w=majority';
const Room = require('./models/Room');
const getWord = require('./api/getWord');

app.use(express.json());

mongoose.connect(db).then(() => {
    console.log('connection succesful to mongo db');
}).catch((e) => {
    console.log(e);
});


io.on('connection', (socket) => {
    console.log("a user connected", socket.id);
    socket.on('create_game', async ({ nick_name, room_name, room_size, max_rounds, bullshit }) => {
        try {
            const existing_room = await Room.findOne({ room_name });
            if (existing_room) {
                socket.emit('notCorrectGame', 'room with that name already exists');
                return;
            }
            let room = new Room();
            const word = getWord();

            room.word = word;
            room.room_name = room_name;
            room.room_size = room_size;
            room.max_rounds = max_rounds;

            let player = {
                socketID: socket.id,
                nick_name,
                isPartyLeader: true,
            }
            room.players.push(player);
            room = await room.save();
            socket.join(room_name);
            io.to(room_name).emit('update_room', room);
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('join_game', async({nick_name,room_name,bullshit}) => {
        try{
            let room = await Room.findOne({room_name});
            if(!room){
                socket.emit('notCorrectGame', 'please enter a valid room name');
                return;
            }

            if(room.isJoin){
                let player = {
                    socketID: socket.id,
                    nick_name,
                }
                room.players.push(player);
                socket.join(room_name);

                if(room.players.length == room.room_size){
                    room.isJoin = false;
                }

                room.turn = room.players[room.turnIndex];
                room = await room.save();
                io.to(room_name).emit('update_room', room);
            }else{
                socket.emit('notCorrectGame', 'this game is in progress, please try later');
            }
        }
        catch(err){
            console.log(err);
        }
    });

    socket.on('paint', ({details, room_name}) => {
        io.to(room_name).emit('points_to_draw', {details: details});
    });

    socket.on('color_change', ({color, room_name}) => {
        io.to(room_name).emit('color_change', color);
    });

    socket.on('stroke_width', ({value, room_name}) => {
        io.to(room_name).emit('stroke_width', value);
    });

    socket.on('erase_all', (room_name) => {
        io.to(room_name).emit('erase_all', '');
    });
});