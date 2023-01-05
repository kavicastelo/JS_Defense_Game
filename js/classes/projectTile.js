class ProjectTile extends Sprites {
    constructor({position = {x:0,y:0}, enemy}) {
        super({position, imgSrc : './img/projectile.png'})
        this.velocity = {
            x: 0,
            y: 0
        }
        this.enemy = enemy
        this.radious = 10
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