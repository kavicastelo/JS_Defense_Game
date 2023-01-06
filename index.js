const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let isPause = undefined

canvas.width = 1280
canvas.height = 577

const placementTilesData2D = []
for (let i = 0; i < placementTilesData.length; i += 40) {
    placementTilesData2D.push(placementTilesData.slice(i, i + 40))
}

const placementTile = []
placementTilesData2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 14) {
            //add placement tile
            placementTile.push(new PlacementTile({
                position: {
                    x: x * 32,
                    y: y * 32
                }
            }))
        }
    })
})

const background = new Image()
background.onload = () => {
    animate()
}
background.src = 'img/defense-game.png'

const enemies = []

function spawnEnemies(spawnCount) {
    for (let i = 1; i < spawnCount + 1; i++) {
        const xOffset = i * 100
        enemies.push(new Enemy({position: {x: waypoints[0].x - xOffset, y: waypoints[0].y}}))
    }
}

const buildings = []
let activeTile = undefined
let enemyCount = 3
let hearts = 10
let coins = 100
const explosions = []
let animationId = undefined
spawnEnemies(enemyCount)

function animate() {
    animationId = requestAnimationFrame(animate)
    c.drawImage(background, 0, 0)
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i]
        enemy.update()

        if (enemy.position.x > canvas.width) {
            enemies.splice(i, 1)
            hearts -= 1
            document.querySelector('#hearts').innerHTML = hearts

            if (hearts === 0) {
                cancelAnimationFrame(animationId)
                document.querySelector('.game-over').style.display = 'flex'
            }
        }

        // make enemies
        if (enemies.length === 0 || enemies.length === 1) {
            enemyCount += 2
            spawnEnemies(enemyCount)
        }
    }

    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i]
        explosion.draw()
        explosion.update()

        if (explosion.frames.current >= explosion.frames.max - 1) {
            explosions.splice(i, 1)
        }
    }

    placementTile.forEach((tile) => {
        tile.update(mouse)
    })
    buildings.forEach((building, i) => {
        building.update()
        building.target = null
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.center.x
            const yDifference = enemy.center.y - building.center.y
            const distance = Math.hypot(xDifference, yDifference)
            return distance < enemy.radious + building.radious
        })
        building.target = validEnemies[0]

        for (let j = building.projectTile.length - 1; j >= 0; j--) {
            const projectTile = building.projectTile[j]

            projectTile.update()

            const xDifference = projectTile.enemy.center.x - projectTile.position.x
            const yDifference = projectTile.enemy.center.y - projectTile.position.y
            const distance = Math.hypot(xDifference, yDifference)

            if (distance < projectTile.enemy.radious + projectTile.radious) {
                projectTile.enemy.health -= 20
                if (projectTile.enemy.health <= 0) {
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectTile.enemy === enemy
                    })
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1)
                        coins += 25
                        document.querySelector('#coins').innerHTML = coins
                    }
                }
                explosions.push(new Sprites({
                    position: {
                        x: projectTile.position.x,
                        y: projectTile.position.y
                    },
                    imgSrc: './img/explosion.png',
                    frames: {
                        max: 4
                    },
                    offset: {
                        x: 0,
                        y: 0
                    }
                }))
                building.projectTile.splice(j, 1)
            }
        }
    })
}



const mouse = {
    x: undefined,
    y: undefined
}
canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
        coins -= 50
        document.querySelector('#coins').innerHTML = coins
        buildings.push(new Building({
            position: {
                x: activeTile.position.x,
                y: activeTile.position.y
            }
        }))
        activeTile.isOccupied = true
        buildings.sort((a, b) => {
            return a.position.y - b.position.y
        })
    }
})
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY

    activeTile = null
    for (let i = 0; i < placementTile.length; i++) {
        const tile = placementTile[i]
        if (mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size) {
            activeTile = tile
            break
        }
    }
})
window.addEventListener('keydown', event => {
    // if (isPause) {
        switch (event.key) {
            case ' ':
                isPause = !isPause
                // pause game
                if (isPause===true){
                    cancelAnimationFrame(animationId)
                    document.querySelector('.start-screen').style.display = 'flex'
                } else {
                    animate()
                    document.querySelector('.start-screen').style.display = 'none'
                }
                break
            case 'x':
                window.close()
        }
    // }
})

