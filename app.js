let express = require('express')
let app = express()
let bodyParser = require('body-parser')

app.use(express.static('web'))

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/index', (req, res) => {

    res.sendFile(`${__dirname}/web/index.html`)
})

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/web/login.html`)
})

app.use((req, res) => {
    res.status(404)
    res.send('bad request bruh')
})

let server = app.listen(3000)

server

let io = require('socket.io').listen(server);

let login = io.of('/login')
let index = io.of('/index')

let room = 'no'
let filled, taken, turn

let roomObj = {}

let availRooms = []

login.on('connection', (socket) => {

    socket.on('checkId', (data) => {
        console.log(roomObj)
        for (key in roomObj) {
            console.log(key)
            if (key == data.roomId) {
                console.log('room taken')
                socket.emit('room taken')
                return
            }
        }

        console.log('room avail')
        socket.emit('valid')
    })

    socket.on('startRoom', (data) => {

        filled = []
        taken = [1, 2]
        turn = 1

        room = data.id

        roomObj[room] = { filled: [], taken: [1, 2], turn: 1 }

        availRooms.push(room)

    })

    socket.on('joinRoom', (data) => {
        let wantRoom = data.id

        if (availRooms.includes(wantRoom)) {
            let promise = new Promise((resolve, reject) => {
                room = wantRoom
                resolve()
            })
            promise.then(() => { socket.emit('roomAvail') })
        } else {
            socket.emit('no such room')
        }

    })
})



index.on('connection', (socket) => {

    if (room != 'no') {
        let promise = new Promise((resolve, reject) => {

            socket.join(room)
            socket.room = room

            resolve()
        })

        promise.then(() => { room = 'no' })

    } else {
        socket.emit('invalid room')
        return
    }


    if (roomObj[socket.room].taken.length > 0) {

        socket.player = roomObj[socket.room].taken.pop()

        console.log(`socket ${socket.id} from room ${room} is player ${socket.player}`)

        socket.emit('player', { player: socket.player })

        if (roomObj[socket.room].taken.length == 1) {
            socket.emit('waiting', { player: roomObj[socket.room].taken[0], roomId: socket.room })
        } else {
            let ind = availRooms.indexOf(socket.room)
            availRooms.splice(ind, 1)
            socket.emit('ready')
        }

    } else {
        socket.emit('room occupied')
    }

    socket.on('ready', () => {
        for (let i = 0; i < roomObj[socket.room].filled.length; i++) {
            let sym = roomObj[socket.room].filled[i][0]
            let sq = roomObj[socket.room].filled[i][1]
            index.to(socket.room).emit('updateBoard', { square: sq, symbol: sym })
        }
    })

    socket.on('squarePress', (data) => {
        if (roomObj[socket.room].turn == data.player) {
            //update next roomObj[socket.room].turn
            if (roomObj[socket.room].turn == 1) {
                roomObj[socket.room].turn = 2
            } else {
                roomObj[socket.room].turn = 1
            }

            index.to(socket.room).emit('updateBoard', { symbol: data.symbol, square: data.square, turn: roomObj[socket.room].turn })

            roomObj[socket.room].filled.push([data.symbol, data.square])

        } else {
            socket.emit('not your turn', {})
        }

    })

    socket.on('won', (data) => {
        console.log(filled)

        roomObj[socket.room].filled = []
        let winner = data.winner
        index.to(socket.room).emit('winner', { winner: winner })
    })


    socket.on('disconnect', () => {
        console.log('disconnect', socket.player)

        if (socket.player != undefined) {
            roomObj[socket.room].taken.push(socket.player)

            if (roomObj[socket.room].taken.length == 2) {
                delete roomObj[socket.room]
            }

            index.to(socket.room).emit('player disconnected', { room: socket.room })

            // console.log('taken when disconnect', roomObj[socket.room].taken)

        }


    })

})

