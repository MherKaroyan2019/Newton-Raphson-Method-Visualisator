if (!sessionStorage["function"] || !sessionStorage["start"] || !sessionStorage["end"] || !sessionStorage["step"] || !sessionStorage["rootTol"] || !sessionStorage["derivTol"]) {
    window.location.href = "./index.html"
}

const table = document.getElementsByTagName("tbody")[0]

const funcNode = math.parse(sessionStorage["function"])
const funcStr = funcNode.toString()
const func = funcNode.compile()

const derivStr = math.derivative(sessionStorage["function"], "x")
const deriv = derivStr.compile()

function roundToPrecision(num, precision) {
  let factor = Math.pow(10, precision)
  return Math.round((num + Number.EPSILON) * factor) / factor
}

function newtonRaphsonMethod(x0, derivativeTol, rootTol, maxIter){
    let x = x0

    let y = func.evaluate({x: x})
    let iterations = []
    iterations.push({x: roundToPrecision(x, rootTol), y: roundToPrecision(y, rootTol)})
    let summary = {}

    for(let i = 0; i < maxIter; i++){
        let f = func.evaluate({x: x})
        let d = deriv.evaluate({x: x})

        if(!isFinite(f)){
            summary = {x: roundToPrecision(x, rootTol), iter: i, res: "Undefined function"}
            return {iterations: iterations, summary: summary}
        }

        if(!isFinite(d)){
            summary = {x: roundToPrecision(x, rootTol), iter: i, res: "Undefined derivative"}
            return {iterations: iterations, summary: summary}
        }
        
        if(Math.abs(d) < Math.pow(10, -derivativeTol)){
            summary = {x: roundToPrecision(x, rootTol), iter: i + 1, res: "Derivative Near Zero"}
            return {iterations: iterations, summary: summary}
        }

        xnew = x - f / d
        ynew = func.evaluate({x: xnew})

        iterations.push({x: roundToPrecision(xnew, rootTol), y: roundToPrecision(ynew, rootTol)})

        if(Math.abs(xnew - x) < Math.pow(10, -rootTol)){
            summary = {x: roundToPrecision(xnew, rootTol), iter: i + 1, res: "Converged"}
            return {iterations: iterations, summary: summary}
        }

        x = xnew
    }

    summary = {x: roundToPrecision(x, rootTol), iter: maxIter, res: "Not Converged"}

    return {iterations: iterations, summary: summary}
}
