if (!sessionStorage["function"] || !sessionStorage["start"] || !sessionStorage["end"] || !sessionStorage["step"] || !sessionStorage["rootTol"] || !sessionStorage["derivTol"]) {
    window.location.href = "./index.html"
}else if(!sessionStorage["x0"]){
    window.location.href = "./table.html"
}

const iterInfo = newtonRaphsonMethod(+sessionStorage["x0"], +sessionStorage["derivTol"], +sessionStorage["rootTol"], 100)
const select = document.getElementById("iter")
const buttons = {
    changeIterButton: document.getElementById("changeIter"),
    goToButton: document.getElementById("goTo"),
    teleportButton: document.getElementById("teleport"),
    originButton: document.getElementById("origin"),
    nextButton: document.getElementById("next"),
    previousButton: document.getElementById("previous")
}
const p = {
    func: document.getElementById("function"),
    deriv: document.getElementById("derivative"),
    tangent: document.getElementById("tangent"),
    iter: document.getElementById("iteration"),
    rootTol: document.getElementById("rootTol"),
    derivativeTol: document.getElementById("derivativeTol"),
    approx: document.getElementById("approximation"),
    f: document.getElementById("f(x)"),
    d: document.getElementById("f'(x)"),
    status: document.getElementById("status")
}


let currentIter = 0

for(let i = 0; i < iterInfo.iterations.length; i++){
    let option = document.createElement("option")
    option.setAttribute("value", i)
    option.innerText = `Iteration ${i}`
    select.appendChild(option)
}

function drawCanvas(tanX, tanY){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawXAxis()
    drawYAxis()
    drawGrid()
    drawTick()
    drawFunction()
    drawTangent(tanX, tanY)
    drawXAxisLabels()
    drawYAxisLabels()
}

p.func.innerHTML = `<strong>Function:</strong>${funcStr}`
p.deriv.innerHTML = `<strong>Derivative:</strong>${derivStr}`
p.rootTol.innerHTML = `<strong>Root Tolerance:</strong>10 ^ -${sessionStorage["rootTol"]}`
p.derivativeTol.innerHTML = `<strong>Derivative Tolerance:</strong>10 ^ -${sessionStorage["derivTol"]}`

function setP(){
    p.tangent.innerHTML = `<strong>Tangent:</strong>${getTangent(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)}`
    p.iter.innerHTML = `<strong>Iteration:</strong>${currentIter}`
    p.approx.innerHTML = `<strong>Approximation:</strong>${iterInfo.iterations[currentIter].x}`
    p.f.innerHTML = `<strong>f(x):</strong>${iterInfo.iterations[currentIter].y}`
    p.d.innerHTML = `<strong>f'(x):</strong>${roundToPrecision(deriv.evaluate({x: iterInfo.iterations[currentIter].x}), sessionStorage["derivTol"])}`
    p.status.innerHTML = `<strong>Status:</strong>${iterInfo.summary.res}`
}

buttons.changeIterButton.addEventListener("click", function(){
    currentIter = +select.value
    drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
    setP()
})

buttons.goToButton.addEventListener("click", function(){
    let x0 = iterInfo.iterations[currentIter]
    settings.camera.centerX = x0.x
    settings.camera.centerY = x0.y

    drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
    setP()
})

buttons.teleportButton.addEventListener("click", function(){
    let inputX = +document.getElementById("xCoord").value
    let inputY = +document.getElementById("yCoord").value

    if(inputX < -1000000){
        settings.camera.centerX = -1000000
    }else if(inputX > 1000000){
        settings.camera.centerX = 1000000
    }else{
        settings.camera.centerX = inputX
    }

    if(inputY < -1000000){
        settings.camera.centerY = -1000000
    }else if(inputY > 1000000){
        settings.camera.centerY = 1000000
    }else{
        settings.camera.centerY = inputY
    }

    drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
    setP()
})

buttons.originButton.addEventListener("click", function(){
    settings.camera.centerX = 0
    settings.camera.centerY = 0

    drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
})

buttons.nextButton.addEventListener("click", function(){
    currentIter++
    if(currentIter == iterInfo.iterations.length){
        currentIter = 0
    }

    select.value = currentIter

    drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
    setP()
})

buttons.previousButton.addEventListener("click", function(){
    currentIter--
    if(currentIter == -1){
        currentIter = iterInfo.iterations.length - 1
    }

    select.value = currentIter

    drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
    setP()
})

drawCanvas(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)
setP()