class Sprites {
    constructor({position = {x:0, y:0}, imgSrc, frames ={max:1}, offset ={x:0,y:0}}) {
        this.position = position
        this.image = new Image()
        this.image.src = imgSrc
        this.frames = {
            max: frames.max,
            current: 0,
            elapsed: 0,
            hold: 5
        }
        this.offset = offset
    }

    draw(){
        const cropWidth = this.image.width / this.frames.max
        const crop = {
            position: {
                x:cropWidth * this.frames.current,
                y:0
            },
            width: cropWidth,
            height: this.image.height
        }
        c.drawImage(
            this.image,
            crop.position.x,
            crop.position.y,
            crop.width,
            crop.height,
            this.position.x + this.offset.x,
            this.position.y + this.offset.y,
            crop.width,
            crop.height)

    }
    update(){
        this.frames.elapsed++
        if (this.frames.elapsed % this.frames.hold ===0) {
            this.frames.current++
            if (this.frames.current >= this.frames.max) {
                this.frames.current = 0
            }
        }
    }
}