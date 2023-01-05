class Building extends Sprites{
    constructor({position = {x:0, y:0}}) {
        super({
            position,
            imgSrc: './img/tower.png',
            frames: {
                max: 19
            },
            offset:{
                x:0,
                y:-40
            }
        })
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
    }

    draw(){
        super.draw()

        c.beginPath()
        c.arc(this.center.x, this.center.y, this.radious, 0, Math.PI * 2)
        c.fillStyle = 'rgba(116, 185, 255,0.1)'
        c.fill()
    }

    update(){
        this.draw()
        if (this.target || (!this.target && this.frames.current !== 0)) super.update()
        if (this.target && this.frames.current===6 && this.frames.elapsed % this.frames.hold ===0){
            this.shoot()
        }
    }

    shoot(){
        this.projectTile.push(
            new ProjectTile({
                position:{
                    x: this.center.x -10,
                    y: this.center.y -60
                },
                enemy: this.target
            })
        )
    }
}