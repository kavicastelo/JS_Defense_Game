class PlacementTile {
    constructor({position = {x:0, y:0}}) {
        this.position = position
        this.size = 32
        this.color = 'rgba(255,255,255,0.1)'
    }

    draw(){
        c.fillStyle=this.color
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update(mouse){
        this.draw()

        if (mouse.x > this.position.x && mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && mouse.y < this.position.y + this.size){
            console.log('done')
        }
    }
}

class Enemy {
    constructor({position={x:0,y:0}}) {
        this.position = position
        this.width = 50
        this.heigth = 50
        this.wayPointIndex = 0
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.heigth /2
        }
    }

    draw(){
        c.fillStyle='red'
        c.fillRect(this.position.x,this.position.y,this.width,this.heigth)
    }

    update(){
        this.draw()

        const waypoint = waypoints[this.wayPointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angel = Math.atan2(yDistance,xDistance)
        this.position.x += Math.cos(angel)
        this.position.y += Math.sin(angel)
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.heigth /2
        }

        if (Math.round(this.center.x) === Math.round(waypoint.x) &&
            Math.round(this.center.y) === Math.round(waypoint.y) &&
            this.wayPointIndex < waypoints.length -1) {
            this.wayPointIndex++
        }
    }
}