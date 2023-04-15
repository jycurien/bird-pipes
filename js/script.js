const startButton = document.getElementById('start-button')
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const pipes = []
let pipeInterval = 150
let score = 0
let isGameStarted = false
let frames = 0
const background = new Image()
background.src = './assets/bg.png'

const bird = {
  x: 100,
  y: canvas.height / 2,
  radius: 20,
  velocity: 0,
  gravity: 0.5,
  jumpHeight: 10,

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'yellow'
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  },

  update() {
    this.velocity += this.gravity
    this.y += this.velocity
  },

  jump() {
    this.velocity = -this.jumpHeight
  },

  collideWithGround() {
    return this.y + this.radius > canvas.height
  },

  collideWithPipe(pipe) {
    const birdTop = this.y - (this.radius - 5)
    const birdBottom = this.y + (this.radius - 5)
    const birdStart = this.x + (this.radius - 5)
    const birdEnd = this.x - (this.radius - 5)
    const pipeTopBottom = pipe.y + pipe.height
    const pipeBottomTop = pipe.y + pipe.height + pipe.gap
    const pipeFront = pipe.x
    const pipeBack = pipe.x + pipe.width
    return (
      (birdBottom > pipeBottomTop || birdTop < pipeTopBottom) &&
      birdStart > pipeFront &&
      birdEnd < pipeBack
    )
  },
}

const pipe = {
  x: canvas.width,
  y: 0,
  width: 80,
  height: Math.random() * (canvas.height / 2) + 50,
  gap: 240,
  speed: 3,

  draw() {
    ctx.fillStyle = 'green'
    ctx.fillRect(this.x, this.y, this.width, this.height)
    ctx.fillRect(this.x, this.height + this.gap, this.width, canvas.height)
  },

  update() {
    this.x -= this.speed
  },

  isOutOfCanvas() {
    return this.x + this.width < 0
  },
}

startButton.addEventListener('click', () => {
  if (!isGameStarted) {
    startGame()
    startButton.style.visibility = 'hidden'
  }
})

function drawScore() {
  ctx.font = '24px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText(`Score: ${score}`, 20, 40)
}

function gameLoop() {
  if (!isGameStarted) {
    return // Skip game loop if game has not started
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(background, 0, 0)

  bird.draw()
  bird.update()

  if (bird.collideWithGround()) {
    endGame()
    return
  }

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].draw()
    pipes[i].update()

    if (bird.collideWithPipe(pipes[i])) {
      endGame()
      return
    }

    if (pipes[i].isOutOfCanvas()) {
      score++
      pipes.splice(i, 1)
      i--
    }
  }

  drawScore()

  if (frames % pipeInterval === 0) {
    const newPipe = Object.assign({}, pipe)
    newPipe.gap = Math.max(150, 240 - score * 10)
    newPipe.height = Math.random() * (canvas.height / 2) + 50
    pipes.push(newPipe)
  }

  frames++

  requestAnimationFrame(gameLoop)
}

function endGame() {
  isGameStarted = false
  ctx.font = '48px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText(`Game Over`, canvas.width / 2 - 80, canvas.height / 2)
  ctx.font = '24px Arial'
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 40)
  startButton.style.visibility = 'visible'
}

function startGame() {
  bird.y = canvas.height / 2
  bird.velocity = 0
  pipes.length = 0
  score = 0
  frames = 0
  isGameStarted = true
  gameLoop()
}

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && isGameStarted) {
    bird.jump()
  }
})