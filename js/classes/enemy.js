class Enemy extends Sprites {
    constructor({position = {x: 0, y: 0}}) {
        super({
            position, imgSrc: './img/orc.png', frames: {
                max: 7
            }
        })
        this.position = position
        this.width = 50
        this.heigth = 50
        this.wayPointIndex = 0
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.heigth / 2
        }
        this.radious = 25
        this.health = 100
        this.velocity = {
            x: 0,
            y: 0
        }
    }

    draw() {
        super.draw()

        // health bar
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y - 15, this.width, 10)
        c.fillStyle = 'green'
        c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / 100, 10)
    }

    update() {
        this.draw()
        super.update()

        const waypoint = waypoints[this.wayPointIndex]
        const yDistance = waypoint.y - this.center.y
        const xDistance = waypoint.x - this.center.x
        const angel = Math.atan2(yDistance, xDistance)

        const speed = 1.5
        this.velocity.x = Math.cos(angel) * speed
        this.velocity.y = Math.sin(angel) * speed
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.heigth / 2
        }

        if (Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < Math.abs(this.velocity.x) &&
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) < Math.abs(this.velocity.y) &&
            this.wayPointIndex < waypoints.length - 1) {
            this.wayPointIndex++
        }
    }
}