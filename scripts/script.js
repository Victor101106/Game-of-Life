import { Conway } from './conway.js'

const firePalette = ['#ffffff', '#FFF200', '#FFBD00', '#FF7800', '#FF4019']
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const conway = new Conway(100, 100)

let offsetX = 0
let offsetY = 0
let scale = 0

// ? Canvas Functions

function draw() {

    context.beginPath()
    context.fillStyle = 'rgb(15, 15, 15)'
    context.rect(0, 0, canvas.width, canvas.height)
    context.fill()
    context.closePath()

    for (let index = conway.generations.length - 1; index >= 0; index--) {
        let generation = conway.generations[index]
        for (let column = 0; column < conway.columns; column++) {
            for (let row = 0; row < conway.rows; row++) {
                if (generation[column][row]) {
                    context.beginPath()
                    context.fillStyle = '#fff'

                    if (conway.fire)
                        context.fillStyle = firePalette[index]
                    
                    if (conway.shadow)
                        context.globalAlpha = 1 / (index + 1)

                    context.rect(column, row, 1, 1)
                    context.fill()
                    context.closePath()
                }
            }
        }
        if (!conway.shadow && !conway.fire) {
            break
        }
    }

    const column = Math.floor(X * conway.columns / canvas.offsetWidth)
    const row = Math.floor(Y * conway.rows / canvas.offsetHeight)

    context.beginPath()
    context.fillStyle = '#fff'
    context.globalAlpha = 0.5
    context.rect(column, row, 1, 1)
    context.fill()
    context.globalAlpha = 1.0
    context.closePath()

    if (!conway.paused)
        conway.generate(1)

    requestAnimationFrame(draw)

}

function zoom(x, y, value) {

    offsetX = (x - canvas.offsetLeft) / canvas.offsetWidth
    offsetY = (y - canvas.offsetTop) / canvas.offsetHeight

    scale = Math.max(scale - value, 1)
    resize()

    canvas.style.left = x - offsetX * canvas.offsetWidth + 'px'
    canvas.style.top = y - offsetY * canvas.offsetHeight + 'px'

}

function resize() {
    canvas.style.height = canvas.height * scale + 'px'
    canvas.style.width = canvas.width * scale + 'px'
}

function center() {
    canvas.style.left = window.innerWidth / 2 - canvas.clientWidth / 2 + 'px'
    canvas.style.top = window.innerHeight / 2 - canvas.clientHeight / 2 + 'px'
}

function onresize() {
    center()
}

function scalate() {
    if (window.innerHeight > window.innerWidth) {
        return window.innerWidth * 0.9 / canvas.width 
    } return window.innerHeight * 0.9 / canvas.height
}

function onload() {
    scale = scalate()
    resize()
    center()
    draw()
}

window.onresize = onresize
window.onload = onload

// ? Editor Functions

let dragging = false
let drawing = false
let canDraw = true
let drawValue = 1
let X = 0
let Y = 0

function drawCell(x, y) {
    const column = Math.floor(x * conway.columns / canvas.offsetWidth)
    const row = Math.floor(y * conway.rows / canvas.offsetHeight)
    conway.generations[0][column][row] = drawValue
}

window.onkeydown = (event) => {
    if (event.ctrlKey) {
        if (event.keyCode == '109' || event.keyCode == '173' || event.keyCode == '189') {
            zoom(window.innerWidth / 2, window.innerHeight / 2, 1.2)
            return event.preventDefault()
        } else if (event.keyCode == '61' || event.keyCode == '107' || event.keyCode == '187') {
            zoom(window.innerWidth / 2, window.innerHeight / 2, -1.2)
            return event.preventDefault()
        }
    }
}

canvas.onmousedown = (event) => {

    offsetX = event.x - canvas.offsetLeft
    offsetY = event.y - canvas.offsetTop

    if (!canDraw || event.shiftKey) {
        return dragging = true
    }

    drawCell(offsetX, offsetY)
    drawing = true

}

canvas.onmousemove = (event) => {

    X = event.x - canvas.offsetLeft
    Y = event.y - canvas.offsetTop

    if (drawing) {
        drawCell(X, Y)
    }

}

window.onmousemove = (event) => {
    if (dragging) {
        canvas.style.left = event.x - offsetX + 'px'
        canvas.style.top = event.y - offsetY + 'px'
    }
}

canvas.onmouseup = (event) => {
    dragging = false
    drawing = false
}

window.addEventListener('wheel', (event) => {
    if (event.ctrlKey) {
        zoom(event.x, event.y, event.deltaY / 2)
        event.preventDefault()
    }
}, {passive: false})

// ? Menu Functions

const pencil = document.querySelector('#menu-pencil')
const erase = document.querySelector('#menu-erase')
const move = document.querySelector('#menu-move')

const pause = document.querySelector('#menu-pause')
const play = document.querySelector('#menu-play')
const stop = document.querySelector('#menu-stop')

const adjust = document.querySelector('#menu-adjust')
const random = document.querySelector('#menu-random')

function deselectEditors() {
    deselect(pencil)
    deselect(erase)
    deselect(move)
}

function deselectControls() {
    deselect(pause)
    deselect(play)
    deselect(stop)
}

function deselect(button) {
    button.classList.remove('selected')
}

function select(button) {
    button.classList.add('selected')
}

pencil.onclick = () => {
    deselectEditors()
    select(pencil)
    drawValue = 1
    canDraw = true
}

erase.onclick = () => {
    deselectEditors()
    select(erase)
    drawValue = 0
    canDraw = true
}

move.onclick = () => {
    deselectEditors()
    select(move)
    canDraw = false
}

pause.onclick = () => {
    deselectControls()
    select(pause)
    conway.paused = true
}

play.onclick = () => {
    deselectControls()
    select(play)
    conway.paused = false
}

stop.onclick = () => {
    deselectControls()
    select(pause)
    conway.clear()
    conway.paused = true
}

random.onclick = () => {
    conway.random()
}

adjust.onclick = () => {
    scale = scalate()
    resize()
    center()
}