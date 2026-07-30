const iterations = newtonRaphsonMethod(+sessionStorage["x0"], 1e-6, 1e-4, 100).iterations
const select = document.getElementById("iter")
const changeIterButton = document.getElementById("changeIter")
const goToButton = document.getElementById("goTo")
const teleportButton = document.getElementById("teleport")
const originButton = document.getElementById("origin")
const nextButton = document.getElementById("next")
const previousButton = document.getElementById("previous")

let currentIter = 0

for(let i = 0; i < iterations.length; i++){
    let option = document.createElement("option")
    option.setAttribute("value", i)
    option.innerText = `Iteration ${i}`
    select.appendChild(option)
}

function drawCanvas(tanX, tanY){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawAxis()
    drawFunction()
    drawTangent(tanX, tanY)
    drawXAxisLabels()
    drawYAxisLabels()
}

changeIterButton.addEventListener("click", function(){
    currentIter = +select.value
    drawCanvas(iterations[currentIter].x, iterations[currentIter].y)
})

goToButton.addEventListener("click", function(){
    let x0 = iterations[currentIter]
    settings.camera.centerX = x0.x
    settings.camera.centerY = x0.y

    drawCanvas(iterations[currentIter].x, iterations[currentIter].y)
})

teleportButton.addEventListener("click", function(){
    let inputX = document.getElementById("xCoord").value
    let inputY = document.getElementById("yCoord").value

    settings.camera.centerX = +inputX
    settings.camera.centerY = +inputY

    drawCanvas(iterations[currentIter].x, iterations[currentIter].y)
})

originButton.addEventListener("click", function(){
    settings.camera.centerX = 0
    settings.camera.centerY = 0

    drawCanvas(iterations[currentIter].x, iterations[currentIter].y)
})

nextButton.addEventListener("click", function(){
    currentIter++
    if(currentIter == iterations.length){
        currentIter = 0
    }

    select.value = currentIter

    drawCanvas(iterations[currentIter].x, iterations[currentIter].y)
})

previousButton.addEventListener("click", function(){
    currentIter--
    if(currentIter == -1){
        currentIter = iterations.length - 1
    }

    select.value = currentIter

    drawCanvas(iterations[currentIter].x, iterations[currentIter].y)
})

drawCanvas(iterations[currentIter].x, iterations[currentIter].y)