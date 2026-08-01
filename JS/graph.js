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
    func: document.getElementById("function").getElementsByTagName("span")[0],
    deriv: document.getElementById("derivative").getElementsByTagName("span")[0],
    tangent: document.getElementById("tangent").getElementsByTagName("span")[0],
    iter: document.getElementById("iteration").getElementsByTagName("span")[0],
    rootTol: document.getElementById("rootTol").getElementsByTagName("span")[0],
    derivativeTol: document.getElementById("derivativeTol").getElementsByTagName("span")[0],
    approx: document.getElementById("approximation").getElementsByTagName("span")[0],
    f: document.getElementById("f(x)").getElementsByTagName("span")[0],
    d: document.getElementById("f'(x)").getElementsByTagName("span")[0],
    status: document.getElementById("status").getElementsByTagName("span")[0]
}


let currentIter = 0

for(let i = 0; i < iterInfo.iterations.length; i++){
    let option = document.createElement("option")
    option.setAttribute("value", i)
    option.textContent = `Iteration ${i}`
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

p.func.textContent = `${funcStr}`
p.deriv.textContent = `${derivStr}`
p.rootTol.textContent = `10 ^ -${sessionStorage["rootTol"]}`
p.derivativeTol.textContent = `10 ^ -${sessionStorage["derivTol"]}`

function setP(){
    p.tangent.textContent = `${getTangent(iterInfo.iterations[currentIter].x, iterInfo.iterations[currentIter].y)}`
    p.iter.textContent = `${currentIter}`
    p.approx.textContent = `${iterInfo.iterations[currentIter].x}`
    p.f.textContent = `${iterInfo.iterations[currentIter].y}`
    p.d.textContent = `${roundToPrecision(deriv.evaluate({x: iterInfo.iterations[currentIter].x}), sessionStorage["derivTol"])}`
    p.status.textContent = `${iterInfo.summary.res}`
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