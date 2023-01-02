const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 577

const placementTilesData2D = []
for (let i = 0; i < placementTilesData.length; i += 40) {
    placementTilesData2D.push(placementTilesData.slice(i,i+40))
}

const placementTile = []
placementTilesData2D.forEach((row, y)=>{
    row.forEach((symbol, x)=>{
        if (symbol === 14) {
            //add placement tile
            placementTile.push(new PlacementTile({
                position:{
                    x: x*32,
                    y: y*32
                }
            }))
        }
    })
})
console.log(placementTile)

const background = new Image()
background.onload = ()=>{
    animate()
}
background.src = 'img/defense-game.png'

const enemies = []
for (let i = 1; i < 10; i++) {
    const xOffset = i *100
    enemies.push(new Enemy({position:{x:waypoints[0].x - xOffset,y:waypoints[0].y}}))
}

function animate(){
    requestAnimationFrame(animate)
    c.drawImage(background,0,0)
    enemies.forEach(enemy=>{
        enemy.update()
    })
    placementTile.forEach((tile)=>{
        tile.update(mouse)
    })

    const mouse = {
        x:undefined,
        y:undefined
    }
    window.addEventListener('mousemove',(event)=>{
        mouse.x = event.clientX
        mouse.y = event.clientY
    })
}
