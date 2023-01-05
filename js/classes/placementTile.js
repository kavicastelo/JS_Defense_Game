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