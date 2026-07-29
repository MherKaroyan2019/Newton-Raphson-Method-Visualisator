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
        fontSize: 15,
        fontFamily: "Arial"
    },
    colors: {
        axis: "#000000",
        function: "#0066ff",
        tangent: "#ff0000",
    }
}
const func =  math.compile(sessionStorage["function"])

function toCanvasX(x){
    return (x - settings.camera.centerX) * settings.camera.pixelPerUnit + settings.canvas.midX
}

function toCanvasY(y){
    return (settings.camera.centerY - y) * settings.camera.pixelPerUnit + settings.canvas.midY
}

function styleConfiguration(){
    ctx.font = `bold ${settings.labels.fontSize}px ${settings.labels.fontFamily}`
    ctx.fillStyle = settings.colors.axis
    ctx.strokeStyle = settings.colors.axis
    ctx.textAlign = "center"
}

function drawAxis(){
    ctx.beginPath()
    ctx.moveTo(0, settings.canvas.midY)
    ctx.lineTo(settings.canvas.width, settings.canvas.midY)

    ctx.moveTo(settings.canvas.midX, 0)
    ctx.lineTo(settings.canvas.midX, settings.canvas.height)
    ctx.stroke()
}

function drawXAxisLabels(){
    let centerX = settings.canvas.midX
    let centerY = settings.canvas.midY
    ctx.beginPath()
    ctx.arc(centerX, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.fillText("x", settings.canvas.width - 15, settings.canvas.midY - 15)
    ctx.stroke()

    for(let i = 1; i <= settings.graph.xTickCount / 2 - 1; i++){
        ctx.beginPath()
        ctx.fillText(-i, settings.canvas.midX - i * settings.camera.pixelPerUnit, settings.canvas.midY + 20)
        ctx.arc(settings.canvas.midX - i * settings.camera.pixelPerUnit, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(0, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.stroke()

    for(let i = 0; i <= settings.graph.xTickCount / 2 - 2; i++){
        ctx.beginPath()
        ctx.fillText(i + 1, settings.canvas.midX + settings.camera.pixelPerUnit * (i + 1), settings.canvas.midY + 20)
        ctx.arc(settings.canvas.midX + settings.camera.pixelPerUnit * (i + 1), settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(settings.canvas.width, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.stroke()
}

function drawYAxisLabels(){
    ctx.beginPath()
    ctx.arc(settings.canvas.midX, settings.canvas.midY, settings.graph.pointRadius, 0, 2 * Math.PI)
    ctx.fillText("y", settings.canvas.midX + 15, 15)
    ctx.stroke()

    for(let i = 0; i < Math.floor(settings.canvas.height / (settings.camera.pixelPerUnit * 2)); i++){
        ctx.beginPath()
        ctx.fillText(i + 1, settings.canvas.midX - 20, settings.canvas.midY - (i + 1) * settings.camera.pixelPerUnit + 5)
        ctx.arc(settings.canvas.midX, settings.canvas.midY - (i + 1) * settings.camera.pixelPerUnit, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    for(let i = 0; i < Math.floor(settings.canvas.height / (settings.camera.pixelPerUnit * 2)); i++){
        ctx.beginPath()
        ctx.fillText(-i - 1, settings.canvas.midX - 20, settings.canvas.midY + (i + 1) * settings.camera.pixelPerUnit + 5)
        ctx.arc(settings.canvas.midX, settings.canvas.midY + (i + 1) * settings.camera.pixelPerUnit, settings.graph.pointRadius, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

function drawFunction(){
    let start = settings.camera.centerX - settings.graph.xTickCount / 2
    let end = settings.camera.centerX + settings.graph.xTickCount / 2
    let coords = []

    for(let i = start * 10; i <= end * 10; i++){
        if(i/10 == settings.camera.centerX){
            coords.push([toCanvasX(settings.camera.centerX), toCanvasY(settings.camera.centerY)])
            continue
        }
        y = func.evaluate({x: i/10})
        coords.push([toCanvasX(i/10), toCanvasY(y)])
    }

    console.log(coords.length)

    ctx.beginPath()
    ctx.moveTo(coords[0][0], coords[0][1])
    for(let i in coords){
        ctx.lineTo(coords[i][0], coords[i][1])
    }
    ctx.stroke()
}

styleConfiguration()
drawAxis()
drawXAxisLabels()
drawYAxisLabels()
drawFunction()