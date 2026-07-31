const canvas = document.getElementById("graph")
const ctx = canvas.getContext('2d');
const settings = {
    camera: {
        centerX: 0,
        centerY: 0,
        pixelPerUnit: 45
    },
    canvas: {
        width: canvas.width,
        height: canvas.height,
        midX: canvas.width / 2,
        midY: canvas.height / 2
    },
    graph: {
        pointRadius: 4,
        functionPointRadius: 2,
        xLabelCount: 20,
        yLabelCount: 14,
        xTickCount: 22,
        yTickCount: 16
    },
    axis: {
        axisXPixel: canvas.width / 2,
        axisYPixel: canvas.height / 2,
        axisX: 0,
        axisY: 0
    },
    labels: {
        fontSize: 11,
        fontFamily: "Arial"
    },
    colors: {
        axis: "#000000",
        semiaxis: "#6a6a6a",
        grid: "#b2b2b2",
        label: "#667b00",
        function: "#0066ff",
        tangent: "#ff0000",
    }
}

function toCanvasX(x){
    return (x - settings.camera.centerX) * settings.camera.pixelPerUnit + settings.canvas.midX
}

function toCanvasY(y){
    return (settings.camera.centerY - y) * settings.camera.pixelPerUnit + settings.canvas.midY
}

function styleConfiguration(type){
    ctx.font = `bold ${settings.labels.fontSize}px ${settings.labels.fontFamily}`
    ctx.fillStyle = settings.colors.label
    switch (type) {
        case "axis":
            ctx.strokeStyle = settings.colors.axis
            break;
        case "semiaxis":
            ctx.strokeStyle = settings.colors.semiaxis
            break;
        case "grid":
            ctx.strokeStyle = settings.colors.grid
            break;
        case "function":
            ctx.strokeStyle = settings.colors.function
            break;
        case "tangent":
            ctx.strokeStyle = settings.colors.tangent
            break;
        default:
            break;
    }
}

function countXAxis(){
    let xLeft = Math.floor(settings.camera.centerX)
    let xRight = Math.ceil(settings.camera.centerX)

    let count = 9
    let start = 0

    let xValues = []
    
    if(xLeft == xRight){
        count = 10
        start = 1
        if(settings.camera.centerX != settings.axis.axisX){
            xValues.push(settings.camera.centerX)
        }
    }

    for(let i = start; i <= count; i++){
        xValues.push(xLeft - i)
        xValues.push(xRight + i)
    }

    return xValues
}

function countYAxis(){
    let yBottom = Math.floor(settings.camera.centerY)
    let yTop = Math.ceil(settings.camera.centerY)

    let count = 6
    let start = 0

    let yValues = []

    if(yBottom == yTop){
        count = 7
        start = 1
        if(settings.camera.centerY != settings.axis.axisY){
            yValues.push(settings.camera.centerY)
        }
    }

    for(let i = start; i <= count; i++){
        yValues.push(yBottom - i)
        yValues.push(yTop + i)
    }

    return yValues
}

function drawXAxis(){
    styleConfiguration("axis")

    let yValues = countYAxis()
    let y = toCanvasY(0)

    if(y >= settings.camera.pixelPerUnit && y <= (settings.canvas.height - settings.camera.pixelPerUnit)){
        styleConfiguration("axis")
        settings.axis.axisYPixel = y
        settings.axis.axisY = 0
    }else if(y < settings.camera.pixelPerUnit){
        styleConfiguration("semiaxis")
        settings.axis.axisYPixel = toCanvasY(yValues[yValues.length - 3])
        settings.axis.axisY = yValues[yValues.length - 3]
    }else if(y > (settings.canvas.height - settings.camera.pixelPerUnit)){
        styleConfiguration("semiaxis")
        settings.axis.axisYPixel = toCanvasY(yValues[yValues.length - 4])
        settings.axis.axisY = yValues[yValues.length - 4]
    }

    ctx.beginPath()
    ctx.moveTo(0, settings.axis.axisYPixel)
    ctx.lineTo(settings.canvas.width, settings.axis.axisYPixel)
    ctx.stroke()
}

function drawYAxis(){
    styleConfiguration("axis")

    let xValues = countXAxis()
    let x = toCanvasX(0)
    if(x >= settings.camera.pixelPerUnit && x <= (settings.canvas.width - settings.camera.pixelPerUnit)){
        styleConfiguration("axis")
        settings.axis.axisXPixel = x
        settings.axis.axisX = 0
    }else if(x < settings.camera.pixelPerUnit){
        styleConfiguration("semiaxis")
        settings.axis.axisXPixel = toCanvasX(xValues[xValues.length - 4])
        settings.axis.axisX = xValues[xValues.length - 4]
    }else if(x > (settings.canvas.width - settings.camera.pixelPerUnit)){
        styleConfiguration("semiaxis")
        settings.axis.axisXPixel = toCanvasX(xValues[xValues.length - 3])
        settings.axis.axisX = xValues[xValues.length - 3]
    }

    ctx.beginPath()
    ctx.moveTo(settings.axis.axisXPixel, 0)
    ctx.lineTo(settings.axis.axisXPixel, settings.canvas.height)
    ctx.stroke()
}

function drawGrid(){
    styleConfiguration("grid")

    let xValues = countXAxis()
    let yValues = countYAxis()

    for(let i = 0; i < xValues.length; i++){
        ctx.beginPath()
        ctx.moveTo(toCanvasX(xValues[i]), 0)
        ctx.lineTo(toCanvasX(xValues[i]), settings.canvas.height)
        ctx.stroke()
    }

    for(let i = 0; i < yValues.length; i++){
        ctx.beginPath()
        ctx.moveTo(0, toCanvasY(yValues[i]))
        ctx.lineTo(settings.canvas.width, toCanvasY(yValues[i]))
        ctx.stroke()
    }
}

function drawTick(){
    styleConfiguration("axis")

    let xValues = countXAxis()
    let yValues = countYAxis()

    for(let i = 0; i < xValues.length; i++){
            ctx.beginPath()
            ctx.arc(toCanvasX(xValues[i]), settings.axis.axisYPixel, settings.graph.pointRadius, 0, 2 * Math.PI)
            ctx.stroke()
    }

    for(let i = 0; i < yValues.length; i++){
            ctx.beginPath()
            ctx.arc(settings.axis.axisXPixel, toCanvasY(yValues[i]), settings.graph.pointRadius, 0, 2 * Math.PI)
            ctx.stroke()
    }
}

function drawXAxisLabels(){
    styleConfiguration("axis")
    let xValues = countXAxis()

    ctx.textAlign = "center"

    ctx.beginPath()
    ctx.fillText("X", settings.canvas.width - 15, settings.axis.axisYPixel - 15)
    ctx.stroke()

    for(let i = 0; i < xValues.length - 2; i++){
        if(xValues[i] == settings.axis.axisX){
            continue
        }
        ctx.beginPath()
        ctx.fillText(xValues[i], toCanvasX(xValues[i]), settings.axis.axisYPixel + 20)
        ctx.stroke()
    }
}

function drawYAxisLabels(){
    styleConfiguration("axis")
    let yValues = countYAxis()

    let orin

    if(settings.axis.axisXPixel <= 45){
        orin = 20
        ctx.textAlign = "left"
    }else{
        orin = -20
        ctx.textAlign = "right"
    }

    ctx.beginPath()
    ctx.fillText("Y", settings.axis.axisXPixel - orin, 15)
    ctx.stroke()

    for(let i = 0; i < yValues.length -2; i++){
        if(yValues[i] == settings.axis.axisY){
            continue
        }
        ctx.beginPath()
        ctx.fillText(yValues[i], settings.axis.axisXPixel + orin, toCanvasY(yValues[i]))
        ctx.stroke()
    }
}

function drawFunction(){
    styleConfiguration("function")

    let start = settings.camera.centerX - settings.graph.xLabelCount / 2
    let end = settings.camera.centerX + settings.graph.xLabelCount / 2
    let coords = []

    for(let i = start * 1000; i <= end * 1000; i++){
        y = func.evaluate({x: i/1000})
        coords.push({x: toCanvasX(i/1000), y: toCanvasY(y)})
    }

    ctx.beginPath()
    ctx.moveTo(coords[0].x, coords[0].y)
    for(let i = 0; i < coords.length; i++){
        if(i == 0){
            continue;
        }

        if(!Number.isFinite(coords[i].y) && i + 1 != coords.length){
            ctx.moveTo(coords[i+1].x, coords[i+1].y)
            continue
        }
        ctx.lineTo(coords[i].x, coords[i].y)
    }
    ctx.stroke()
}

function getTangent(tanX, tanY){
    k = deriv.evaluate({x: tanX})

    return `${k} * (x - ${tanX}) + ${tanY}`
}

function drawTangent(tanX, tanY){
    styleConfiguration("tangent")

    let tangentStr = getTangent(tanX, tanY)
    let tangent = math.compile(tangentStr)
    let start = settings.camera.centerX - settings.graph.xLabelCount / 2
    let end = settings.camera.centerX + settings.graph.xLabelCount / 2
    let border1 = tangent.evaluate({x: start})
    let border2 = tangent.evaluate({x: end})

    ctx.beginPath()
    ctx.moveTo(toCanvasX(start), toCanvasY(border1))
    ctx.lineTo(toCanvasX(end), toCanvasY(border2))
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(toCanvasX(tanX), toCanvasY(tanY), settings.graph.pointRadius / 2, 0, 2 * Math.PI)
    ctx.stroke()


}