let socket = io('http://glendatxn.local:3000/login')

let roomNames = ['car', 'cat', 'dog', 'bot', 'goat', 'math', 'jog', 'rod', 'hot', 'moat', 'grass']

let id

let genRoom = () => {
    let ind1 = Math.floor(Math.random() * roomNames.length)
    let ind2 = Math.floor(Math.random() * roomNames.length)

    id = roomNames[ind1] + ' ' + roomNames[ind2]
}

genRoom()
socket.emit('checkId', { roomId: id })

socket.on('valid', () => {
    document.getElementById('roomId').innerHTML = `<strong>${id}</strong>`
})

socket.on('room taken', () => {
    genRoom()
    socket.emit('checkId', { roomId: id })
})

let startNew = () => {

    socket.emit('startRoom', { id: id })

    window.location.href = `http://glendatxn.local:3000/index`

}


let joinRoom = () => {
    let room = document.getElementById('subRoom').value
    socket.emit('joinRoom', { id: room })

    socket.on('roomAvail', () => {
        window.location.href = `http://glendatxn.local:3000/index`
    })

    socket.on('no such room', () => {
        window.alert('there is no such room available. double check spelling and spacing')
    })

}