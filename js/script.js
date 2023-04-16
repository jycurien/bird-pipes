const startButton = document.getElementById('start-button')
const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const pipes = []
let pipeInterval = 150
let score = 0
let isGameStarted = false
let frames = 0
const background = new Image()
background.src = 'assets/bg.jpg'
const birdFrame = new Image()
birdFrame.src = 'assets/bird-frame-1.png'

const bird = {
  x: 100,
  y: canvas.height / 2,
  width: 60,
  height: 45,
  velocity: 0,
  gravity: 0.5,
  jumpHeight: 10,
  frame: birdFrame,
  frameNum: 1,

  draw() {
    if (frames % 6 === 0) {
      this.switchFrame()
    }
    ctx.drawImage(this.frame, this.x, this.y, this.width, this.height)
  },

  switchFrame() {
    this.frameNum = this.frameNum === 1 ? 2 : 1
    this.frame.src = `assets/bird-frame-${this.frameNum}.png`
  },

  update() {
    this.velocity += this.gravity
    this.y += this.velocity
  },

  jump() {
    this.velocity = -this.jumpHeight
  },

  collideWithGround() {
    return this.y + this.height > canvas.height
  },

  collideWithPipe(pipe) {
    const birdTop = this.y
    const birdBottom = this.y + this.height
    const birdStart = this.x + this.width
    const birdEnd = this.x
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

function drawScore() {
  ctx.font = '24px Arial'
  ctx.fillStyle = 'black'
  ctx.fillText(`Score: ${score}`, 20, 40)
}

function gameLoop() {
  if (!isGameStarted) {
    return
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(background, 0, 0, 800, 600)

  bird.update()
  bird.draw()

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
  ctx.fillText(`Game Over`, canvas.width / 2 - 120, canvas.height / 2)
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

startButton.addEventListener('click', () => {
  if (!isGameStarted) {
    startGame()
    startButton.style.visibility = 'hidden'
  }
})

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && isGameStarted) {
    bird.jump()
  }
})
