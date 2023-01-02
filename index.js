const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.width = 30
        this.heigth = 30
    }
    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.heigth)
    }
}

const player = new Player()
player.draw()