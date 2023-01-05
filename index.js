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

function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i *100
        enemies.push(new Enemy({position:{x:waypoints[0].x - xOffset,y:waypoints[0].y}}))
    }
}

const buildings = []
let activeTile = undefined
let enemyCount = 3
let hearts = 10
let coins = 100
spawnEnemies(enemyCount)

function animate(){
    const animationId = requestAnimationFrame(animate)
    c.drawImage(background,0,0)
    for (let i = enemies.length -1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.update()

        if (enemy.position.x > canvas.width){
            enemies.splice(i,1)
            hearts -= 1
            document.querySelector('#hearts').innerHTML = hearts

            if (hearts === 0){
                cancelAnimationFrame(animationId)
                document.querySelector('.game-over').style.display='flex'
            }
        }
        // make enemies
        console.log(enemies.length)
        if (enemies.length === 0){
            enemyCount += 2
            spawnEnemies(enemyCount)
        }
    }
    placementTile.forEach((tile)=>{
        tile.update(mouse)
    })
    buildings.forEach((building, i)=>{
        building.update()
        building.target = null
        const validEnemies = enemies.filter(enemy=>{
            const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot(xDifference,yDifference)
            return distance < enemy.radious + building.radious
        })
        building.target = validEnemies[0]

        for (let j = building.projectTile.length -1; j >= 0; j--) {
            const projectTile = building.projectTile[j]

            projectTile.update()

            const xDifference = projectTile.enemy.center.x - projectTile.position.x
            const yDifference = projectTile.enemy.center.y - projectTile.position.y
            const distance = Math.hypot(xDifference,yDifference)

            if (distance < projectTile.enemy.radious + projectTile.radious) {
                projectTile.enemy.health -= 20
                if (projectTile.enemy.health <= 0){
                    const enemyIndex = enemies.findIndex((enemy)=>{
                        return projectTile.enemy === enemy
                    })
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex,1)
                        coins += 25
                        document.querySelector('#coins').innerHTML = coins
                    }
                }
                building.projectTile.splice(j, 1)
            }
        }
    })
}
const mouse = {
    x:undefined,
    y:undefined
}
canvas.addEventListener('click',(event)=>{
    if (activeTile && !activeTile.isOccupied && coins - 50 >= 0){
        coins -= 50
        document.querySelector('#coins').innerHTML = coins
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
