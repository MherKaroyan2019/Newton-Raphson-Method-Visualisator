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
        xTickCount: 20,
        yTickCount: 12
    },
    labels: {
        fontSize: 12,
        fontFamily: "Arial"
    },
    colors: {
        axis: "#000000",
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
    switch (type) {
        case "axis":
            ctx.fillStyle = settings.colors.label
            ctx.strokeStyle = settings.colors.axis
            break;
        case "function":
            ctx.fillStyle = settings.colors.function
            ctx.strokeStyle = settings.colors.function
            break;
        case "tangent":
            ctx.fillStyle = settings.colors.tangent
            ctx.strokeStyle = settings.colors.tangent
            break;
        default:
            break;
    }
}

function drawAxis(){
    styleConfiguration("axis")
    ctx.beginPath()
    ctx.moveTo(0, settings.canvas.midY)
    ctx.lineTo(settings.canvas.width, settings.canvas.midY)

    ctx.moveTo(settings.canvas.midX, 0)
    ctx.lineTo(settings.canvas.midX, settings.canvas.height)
    ctx.stroke()
}

function drawXAxisLabels(){
    styleConfiguration("axis")
    let centerX = settings.canvas.midX
    let centerY = settings.canvas.midY
    ctx.beginPath()
    ctx.arc(centerX, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.fillText("x", settings.canvas.width - 15, settings.canvas.midY - 15)
    ctx.stroke()

    ctx.textAlign = "left"

    for(let i = 1; i <= settings.graph.xTickCount / 2 - 1; i++){
        ctx.beginPath()
        ctx.fillText(roundToPrecision(settings.camera.centerX - i, 4), settings.canvas.midX - i * settings.camera.pixelPerUnit, settings.canvas.midY + 20)
        ctx.arc(settings.canvas.midX - i * settings.camera.pixelPerUnit, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(0, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.textAlign = "right"

    for(let i = 0; i <= settings.graph.xTickCount / 2 - 2; i++){
        ctx.beginPath()
        ctx.fillText(roundToPrecision(settings.camera.centerX + i + 1, 4), settings.canvas.midX + settings.camera.pixelPerUnit * (i + 1), settings.canvas.midY + 20)
        ctx.arc(settings.canvas.midX + settings.camera.pixelPerUnit * (i + 1), settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(settings.canvas.width, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.stroke()
}

function drawYAxisLabels(){
    ctx.textAlign = "right"
    styleConfiguration("axis")
    ctx.beginPath()
    ctx.arc(settings.canvas.midX, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.fillText("y", settings.canvas.midX + 15, 15)
    ctx.stroke()

    for(let i = 0; i < Math.floor(settings.canvas.height / (settings.camera.pixelPerUnit * 2)); i++){
        ctx.beginPath()
        ctx.fillText(roundToPrecision(settings.camera.centerY + i + 1, 4), settings.canvas.midX - 20, settings.canvas.midY - (i + 1) * settings.camera.pixelPerUnit + 5)
        ctx.arc(settings.canvas.midX, settings.canvas.midY - (i + 1) * settings.camera.pixelPerUnit, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    for(let i = 0; i < Math.floor(settings.canvas.height / (settings.camera.pixelPerUnit * 2)); i++){
        ctx.beginPath()
        ctx.fillText(roundToPrecision(settings.camera.centerY - i - 1, 4), settings.canvas.midX - 20, settings.canvas.midY + (i + 1) * settings.camera.pixelPerUnit + 5)
        ctx.arc(settings.canvas.midX, settings.canvas.midY + (i + 1) * settings.camera.pixelPerUnit, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

function drawFunction(){
    styleConfiguration("function")
    let start = settings.camera.centerX - settings.graph.xTickCount / 2
    let end = settings.camera.centerX + settings.graph.xTickCount / 2
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

function drawTangent(tanX, tanY){
    styleConfiguration("tangent")

    k = deriv.evaluate({x: tanX})

    let tangent = math.compile(`${k} * (x - ${tanX}) + ${tanY}`)
    let start = settings.camera.centerX - settings.graph.xTickCount / 2
    let end = settings.camera.centerX + settings.graph.xTickCount / 2
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