class PlacementTile {
    constructor({position = {x:0, y:0}}) {
        this.position = position
        this.size = 32
        this.color = 'rgba(255,255,255,0.1)'
        this.isOccupied = false
    }

    draw(){
        c.fillStyle=this.color
        c.fillRect(this.position.x, this.position.y, this.size, this.size)
    }

    update(mouse){
        this.draw()

        if (mouse.x > this.position.x && mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && mouse.y < this.position.y + this.size){
            this.color = 'rgba(52, 152, 219,0.3)'
        } else {
            this.color = 'rgba(255,255,255,0.1)'
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
        this.radious = 25
        this.health = 100
        this.velocity ={
            x:0,
            y:0
        }
    }

    draw(){
        c.fillStyle='red'
        //c.fillRect(this.position.x,this.position.y,this.width,this.heigth)
        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radious, 0, Math.PI * 2)
        c.fill()

        // health bar
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y - 15, this.width, 10)
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10)
    }

    update(){
        this.draw()

        const waypoint = waypoints[this.wayPointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angel = Math.atan2(yDistance,xDistance)

        const speed = 1.5
        this.velocity.x = Math.cos(angel) * speed
        this.velocity.y = Math.sin(angel) * speed
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.heigth /2
        }

        if (Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
            this.wayPointIndex < waypoints.length -1) {
            this.wayPointIndex++
        }
    }
}

class ProjectTile {
    constructor({position = {x:0,y:0}, enemy}) {
        this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
        this.enemy = enemy
        this.radious = 10
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radious, 0, Math.PI * 2)
        c.fillStyle = 'orange'
        c.fill()
    }

    update(){
        this.draw()

        const angle = Math.atan2(this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x)

        const power = 2
        this.velocity.x = Math.cos(angle) * power
        this.velocity.y = Math.sin(angle) * power

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Building {
    constructor({position = {x:0, y:0}}) {
        this.position = position
        this.width = 32 * 2
        this.height = 34
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height / 2
        }
        this.projectTile = []
        this.radious = 150
        this.target = undefined
        this.frames = 0
    }

    draw(){
        c.fillStyle='blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radious, 0, Math.PI * 2)
        c.fillStyle = 'rgba(0,0,255, 0.2)'
        c.fill()
    }

    update(){
        this.draw()
        if (this.frames % 100 === 0 && this.target){
            this.projectTile.push(
                new ProjectTile({
                    position:{
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target
                })
            )
        }
        this.frames++
    }
}