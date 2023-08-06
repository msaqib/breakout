const blockWidth = 100;
const blockHeight = 20;
const grid = document.querySelector('.grid')

document.addEventListener('keydown', moveBat)

const bat = new Block(280, 10, blockWidth, blockHeight)
displayBlock(bat, 'bat')

function moveBat(event) {
    const key = event.key
    switch(key) {
    case 'ArrowLeft':
        if (bat.bottomLeft.x > 10) {
            bat.setX(bat.bottomLeft.x - 10)
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
}

Block.prototype.setX = function(x) {
        this.bottomLeft.x = x;
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