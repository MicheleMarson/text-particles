const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let particleArray = []
let adjustX = 10
let adjustY = 10

// handle mouse
const mouse = {
  x: null,
  y:null,
  radius:120,
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x
  mouse.y = e.y
  // console.log(mouse);
})

ctx.textAlign = "center"
ctx.fillStyle = "#fff"
ctx.font = "18px Verdana"
ctx.fillText("Mihaela",100, 70)
ctx.strokeStyle = "#fff"
const textCoordinates = ctx.getImageData(60,40,300,300) //Uint8ClampedArray

class Particle{
  constructor(x, y){
    this.x = x
    this.y = y
    this.size = 3
    // remember x nd y to return to that position
    this.baseX = this.x // particles original position
    this.baseY = this.y
    this.density = (Math.random() * 30) + 15
  }
  draw(){
    ctx.fillStyle = "tomato"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
  update(){
    // pythagoras theorem
    // physics 
    let dx = mouse.x - this.x
    let dy = mouse.y - this.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let forceDirectionX = dx / distance
    let forceDirectionY = dy / distance
    let maxDistance = mouse.radius
    let force = (maxDistance - distance)/maxDistance
    let directionX = forceDirectionX * force * this.density
    let directionY = forceDirectionY * force * this.density

    if(distance < mouse.radius){
      // this.size = 10
      this.x -= directionX
      this.y -= directionY
    }else{
      if(this.x !== this.baseX){//if this.x changed
        let dx = this.x - this.baseX
        this.x -= dx/10
      }
      if(this.y !== this.baseY){
        let dy = this.y - this.baseY
        this.y -= dy/10
      }
    }
  }
}

function init(){
  particleArray = []
  //run for every pixel of text
  for(let y = 0, y2 = textCoordinates.height; y < y2; y++){ 
    for(let x = 0, x2 = textCoordinates.width; x < x2; x++){
      //if opacity is more than 128
      if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){ // skip every forth item
        let positionX = x + adjustX
        let positionY = y + adjustY
        particleArray.push(new Particle(positionX * 10, positionY * 10))
      }
    }
  }
}

init()
console.log(particleArray);

function animate(){
  ctx.clearRect(0,0,canvas.width, canvas.height)
  for(let i = 0; i < particleArray.length; i++){
    particleArray[i].draw()
    particleArray[i].update()
  }
  connect()
  requestAnimationFrame(animate)
}

animate()

function connect(){
  let opacityValue = 1

  for(let a = 0; a < particleArray.length; a++){
    for(let b = a; b < particleArray.length; b++){
      // let dx = mouse.x - this.x
      // let dy = mouse.y - this.y
      // let distance = Math.sqrt(dx * dx + dy * dy)
      let dx = particleArray[a].x - particleArray[b].x
      let dy = particleArray[a].y - particleArray[b].y
      let distance = Math.sqrt(dx*dx + dy*dy)
      if(distance < 28){
        opacityValue = 1 - (distance/50)
        ctx.strokeStyle = "rgba(255, 99, 71,"+opacityValue+")"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(particleArray[a].x, particleArray[a].y)
        ctx.lineTo(particleArray[b].x, particleArray[b].y)
        ctx.stroke()
      }
    }
  }
}