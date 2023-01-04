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
//console.log(placementTile)

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

const buildings = []
let activeTile = undefined

function animate(){
    requestAnimationFrame(animate)
    c.drawImage(background,0,0)
    enemies.forEach(enemy=>{
        enemy.update()
    })
    placementTile.forEach((tile)=>{
        tile.update(mouse)
    })
    buildings.forEach((building)=>{
        building.draw()
        building.projectTile.forEach(projectTile=>{
            projectTile.update()
        })
    })
}
const mouse = {
    x:undefined,
    y:undefined
}
canvas.addEventListener('click',(event)=>{
    if (activeTile && !activeTile.isOccupied){
        buildings.push(new Building({
            position:{
                x:activeTile.position.x,
                y:activeTile.position.y
            }
        }))
        activeTile.isOccupied =true
    }
})
window.addEventListener('mousemove',(event)=>{
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null
    for (let i = 0; i < placementTile.length; i++) {
        const tile = placementTile[i]
        if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size){
            activeTile = tile
            break
        }
    }
})
