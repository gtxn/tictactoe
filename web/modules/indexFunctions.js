
let checkSquare = (a, b) => {
    let arr = user.squaresFilled

    for (let i = 0; i < arr.length; i++) {
        if (arr[i][0] == a && (arr[i][1] == b)) {
            return true
        }
    }
}


let checkWin = () => {
    console.log('check win')

    if (checkSquare(1, 1) && checkSquare(1, 2) && checkSquare(1, 3)) {
        console.log('1')
        return true
    }
    else if (checkSquare(2, 1) && checkSquare(2, 2) && checkSquare(2, 3)) {
        console.log('2')
        return true
    }
    else if (checkSquare(3, 1) && checkSquare(3, 2) && checkSquare(3, 3)) {
        console.log('3')
        return true
    }
    else if (checkSquare(1, 1) && checkSquare(2, 1) && checkSquare(3, 1)) {
        console.log('4')
        return true
    }
    else if (checkSquare(1, 2) && checkSquare(2, 2) && checkSquare(3, 2)) {
        console.log('5')
        return true
    }
    else if (checkSquare(1, 3) && checkSquare(2, 3) && checkSquare(3, 3)) {
        console.log('6')
        return true
    }
    else if (checkSquare(1, 1) && checkSquare(2, 2) && checkSquare(3, 3)) {
        console.log('7')
        return true
    }
    else if (checkSquare(1, 3) && checkSquare(2, 2) && checkSquare(3, 1)) {
        console.log('8')
        return true
    } else {
        return false
    }
}

let filled = () => {
    let btns = document.getElementsByTagName('button')
    for (let i = 0; i < btns.length; i++) {
        if (btns[i].innerHTML == ' ') {
            return false
        }
    }

    return true
}

let fillSq = (button) => {

    let btn = document.getElementById(button.toString())

    if (btn.innerHTML == ' ') {
        user.squaresFilled.push(button)

        socket.emit('squarePress', { symbol: user.symbol, square: button, player: user.player })
    } else {
        window.alert('square is already filled. Stop tryna cheat i see you')
    }

    if (checkWin()) {
        user.won = true
    }

}

let putSq = (symbol, btn) => {
    btn.innerHTML = symbol

    btn.style.paddingLeft = '44px'
    btn.style.paddingRight = '44px'
    btn.style.paddingTop = '40px'
    btn.style.paddingBottom = '40px'

    if (symbol == 'X') {
        btn.style.backgroundColor = 'cyan'
    } else {
        btn.style.backgroundColor = 'pink'
    }

}