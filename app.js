const boardWidth = 670
const boardHeight = 300

const blockWidth = 100
const blockHeight = 20

const ballWidth = 10
const ballHeight = 10
const ballSpeed = 50

const maxScore = 180

let xDirection = -2
let yDirection = 2

const grid = document.querySelector('.grid')

document.addEventListener('keydown', moveBat)

const bat = new Block(280, 10, blockWidth, blockHeight)
displayBlock(bat, 'bat')

const ball = new Block(280, 50, ballWidth, ballHeight)
displayBlock(ball, 'ball')

const scoreSpan = document.getElementById('score')
const gameover = document.getElementById('gameover')

let score = 0

function moveBat(event) {
    const key = event.key
    switch(key) {
    case 'ArrowLeft':
        if (bat.bottomLeft.x >= 10) {
            bat.setX(bat.bottomLeft.x - 10)
            const bElement = document.querySelector('.bat');
            bElement.style.left = bat.bottomLeft.x + 'px'
        }        
        break
    case 'ArrowRight':
        if (bat.bottomLeft.x <= 560) {
            bat.setX(bat.bottomLeft.x + 10)
            const bElement = document.querySelector('.bat');
            bElement.style.left = bat.bottomLeft.x + 'px'
        }        
        break;
    }
}

function Block(left, bottom, width, height) {
    this.bottomLeft = {x:left, y: bottom}
    this.bottomRight = {x:left + width, y: bottom}
    this.topLeft = {x: left, y: bottom + height}
    this.topRight = {x: left + width, y: bottom + height}
    this.width = width
    this.height = height
}

Block.prototype.setX = function(x) {
        this.bottomLeft.x = x;
        this.bottomRight.x = x + this.width
        this.topRight.x = x + this.width
        this.topLeft.x = x
}

Block.prototype.setY = function(y) {
        this.bottomLeft.y = y;
        this.topLeft.y = y + this.height;
        this.bottomRight.y = y;
        this.topRight.y = y + this.height;
}

const blocks = []

createRows()
displayBlocks()

function displayBlocks() {
    blocks.forEach( b => displayBlock(b, 'block'))
}

function displayBlock(b, style) {
    const block = document.createElement('div')
        block.classList.add(style)
        block.style.left = b.bottomLeft.x + 'px'
        block.style.bottom = b.bottomLeft.y + 'px'
        grid.appendChild(block)
}

function createRows() {
    for (let j = 1 ; j < 4 ; j++) {
        for (let i = 0 ; i < 6 ; i++) {
            const block = new Block( 10 + i * (blockWidth + 10), 300 - j * (20 + 10), blockWidth, blockHeight)
            blocks.push(block)
        }
    }
}

function moveBall() {
    checkCollision()
    scoreSpan.innerHTML = score
    if (score === maxScore) {
        gameover.innerHTML = " (YOU WON!)"
        stop()
    }
    ball.setX(ball.bottomLeft.x + xDirection)
    ball.setY(ball.bottomLeft.y + yDirection)
    const ballElement = document.querySelector('.ball')
    ballElement.style.left = ball.bottomLeft.x + 'px'
    ballElement.style.bottom = ball.bottomLeft.y + 'px'
}

const refresh = setInterval(moveBall, ballSpeed)

function checkCollision() {
    // Did we hit the bat
    if (ball.bottomRight.x >= bat.topLeft.x && ball.bottomLeft.x <= bat.topRight.x && ball.bottomRight.y === bat.topRight.y){
        yDirection = -1 * yDirection
        // if we hit the bat on the right half it should bounce off to the right
        // otherwise to the left
        if (ball.bottomLeft.x - bat.topLeft.x < (blockWidth / 2)) {
            xDirection = -2
        }
        else {
            xDirection = 2
        }
    }
    // Check bounds of the play board
    // Did we hit the right or left wall
    if (ball.topRight.x === boardWidth || ball.topLeft.x === 0) {
        xDirection = -1 * xDirection
    }
    // Did we hit the top wall
    else if (ball.topRight.y === boardHeight) {
        yDirection = -1 * yDirection
    }
    // Did we hit the bottom wall
    else if (ball.bottomRight.y === 0) {
        stop()
        gameover.innerHTML = " (GAME OVER)"
    }
    // Did we hit a block
    else {
        const blkIndex = blocks.findIndex(checkBounds)
        if (blkIndex >= 0) {
            // If we hit a side wall, we need to reverse the x direction,
            // otherwise we need to reverse the y direction
            if (hitSide(blocks[blkIndex]))
                xDirection = -1 * xDirection
            else 
                yDirection = -1 * yDirection
            const allBlocks = document.querySelectorAll('.block')
            grid.removeChild(allBlocks[blkIndex])
            blocks.splice(blkIndex, 1)
            score = score + 10
        }   
    }
}

function checkBounds(b) {
    if (
    ball.bottomRight.x < b.bottomLeft.x || // Ball is to the left of b
    ball.bottomLeft.x > b.bottomRight.x || // Ball is to the right of b
    ball.bottomRight.y > b.topRight.y ||   // Ball is above b
    ball.topRight.y < b.bottomRight.y      // Ball is below b
  ) {
    return false; // No collision
  
  }
  return true; // Collision detected
}

function hitSide(b) {
    if (ball.bottomLeft.y >= b.bottomRight.y && ball.bottomLeft.y <= b.topRight.y )
        return true
    if (ball.bottomRight.y >= b.bottomLeft.y && ball.bottomRight.y <= b.topLeft.y )
        return true
    return false
}

function stop() {
    clearInterval(refresh)
    document.removeEventListener('keydown', moveBat)
}