let socket = io('http://glendatxn.local:3000/index');

let user = {
    player: 0,
    symbol: '',
    squaresFilled: [],
    won: false,
    wins: 0,
    losses: 0,
}

let p = document.getElementById('turn')


socket.on('player', (data) => {
    console.log(data.player)
    user.player = data.player
    user.squaresFilled = []

    if (user.player == 1) {
        user.symbol = 'X'
    }
    else if (user.player == 2) {
        user.symbol = 'O'
    }
})

let pr1
socket.on('updateBoard', (data) => {

    let btn = document.getElementById(data.square.toString())

    pr1 = new Promise((resolve, reject) => {
        btn.innerHTML = data.symbol
        console.log('first', btn, data.symbol)
        resolve()
    })

    putSq(data.symbol, btn)

    let turn = data.turn

    if (turn == user.player) {
        p.innerHTML = "Your turn"
    } else {
        p.innerHTML = "Waiting for opponent..."
    }

    if (user.won) {
        console.log('valiating win')
        socket.emit('won', { winner: user.player })
    }

    if (filled()) {
        window.alert('game is over.')

        let btnArr = document.getElementsByTagName('button')

        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].innerHTML = ' '

            btnArr[i].style.paddingLeft = '50px'
            btnArr[i].style.paddingRight = '50px'
            btnArr[i].style.paddingTop = '50px'
            btnArr[i].style.paddingBottom = '50px'
        }

        user.squaresFilled = []
    }
})


socket.on('winner', (data) => {
    let btnArr = document.getElementsByTagName('button')

    user.squaresFilled = []
    console.log('squares', user.squaresFilled)

    console.log('winner', data.winner)
    console.log('player', user.player)

    pr1.then(() => {

        return new Promise((resolve, reject) => {
            user.won = false
            setTimeout(() => {
                console.log('second')
                if (data.winner == user.player) {
                    window.alert('congrats you won!')
                    user.wins += 1
                }
                else if (data.winner == user.player - 1 || data.winner == user.player + 1) {
                    window.alert('you lost... sorry')
                    user.losses += 1
                }

                document.getElementById('score').innerHTML = `Wins: ${user.wins} Losses: ${user.losses}`

                resolve()

            }, 500)
        })

    }).then((val) => {
        console.log(val)

        for (let i = 0; i < btnArr.length; i++) {
            btnArr[i].innerHTML = ' '

            btnArr[i].style.paddingLeft = '50px'
            btnArr[i].style.paddingRight = '50px'
            btnArr[i].style.paddingTop = '50px'
            btnArr[i].style.paddingBottom = '50px'

            btnArr[i].style.backgroundColor = 'white'
        }
    })

})


socket.on('not your turn', () => {
    console.log('not your turn!')
    window.alert('its not your turn you annoying')
})

socket.on('room occupied', () => {
    let body = document.getElementById('body')
    body.innerHTML = 'sorry the room is full'
})

socket.on('waiting', (data) => {
    let room = data.roomId
    console.log('waiting for someone to join room', room)
    p.innerHTML = `Waiting for player ${data.player} to connect. <br> Your room is <strong>${room}</strong>`
})

socket.on('ready', () => {
    console.log('ready')
    p.innerHTML = `both players are connected. Ready to start`

    setTimeout(() => {
        if (1 == user.player) {
            p.innerHTML = "Your turn"
        } else {
            p.innerHTML = "Waiting for opponent..."
        }
    }, 500)
})

socket.on('invalid room', () => {
    console.log('inval')
    document.body.innerHTML = "Something went wrong. You are currently not in any room. Please try again in the <a href='http://glendatxn.local:3000/login'>login</a> screen"
})

socket.on('player disconnected', (data) => {
    let room = data.room
    p.innerHTML = `other player disconnected. Your game has ended, please leave the room and create a new room.`
})