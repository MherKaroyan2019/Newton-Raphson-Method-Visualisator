const table = document.getElementsByTagName("tbody")[0]

const func =  math.compile(sessionStorage["function"])
const deriv = math.derivative(sessionStorage["function"], "x").compile()

function roundToPrecision(num, precision) {
  let factor = Math.pow(10, precision)
  return Math.round((num + Number.EPSILON) * factor) / factor
}

function newtonRaphsonMethod(x0, derivativeTol, rootTol, maxIter){
    let x = x0
    let y = func.evaluate({x: x})
    let iterations = []
    iterations.push({x: roundToPrecision(x, 4), y: roundToPrecision(y, 4)})
    let summary
    for(let i = 0; i < maxIter; i++){
        let f = func.evaluate({x: x})
        let d = deriv.evaluate({x: x})

        if(!isFinite(f)){
            summary = {x: roundToPrecision(x, 4), iter: i, res: "Undefined function"}
            return {iterations: iterations, summary: summary}
        }

        if(!isFinite(d)){
            summary = {x: roundToPrecision(x, 4), iter: i, res: "Undefined derivative"}
            return {iterations: iterations, summary: summary}
        }
        
        if(Math.abs(d) < derivativeTol){
            summary = {x: roundToPrecision(x, 4), iter: i + 1, res: "Derivative Near Zero"}
            return {iterations: iterations, summary: summary}
        }

        xnew = x - f / d
        ynew = func.evaluate({x: xnew})

        iterations.push({x: roundToPrecision(xnew, 4), y: roundToPrecision(ynew, 4)})

        if(Math.abs(xnew - x) < rootTol){
            summary = {x: roundToPrecision(xnew, 4), iter: i + 1, res: "Converged"}
            return {iterations: iterations, summary: summary}
        }

        x = xnew
    }

    summary = {x: roundToPrecision(x, 4), iter: maxIter, res: "Not Converged"}

    return {iterations: iterations, summary: summary}
}