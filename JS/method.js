if (!sessionStorage.length) {
    window.location.href = "./index.html"
}

let table = document.getElementsByTagName("tbody")[0]
console.log(table)

let funcStr = sessionStorage.getItem("function")
let func = math.compile(funcStr)

let derivStr = math.derivative(funcStr, "x")
let deriv = derivStr.compile()


function newtonRaphsonMethod(x0, derivativeTol, rootTol, maxIter){
    let x = x0
    for(let i = 0; i < maxIter; i++){
        let f = func.evaluate({x: x})
        let d = deriv.evaluate({x: x})
        
        if(Math.abs(d) < derivativeTol){
            return {x: x, iter: i + 1, res: "Derivative Near Zero"}
        }

        xnew = x - f / d

        if(Math.abs(xnew - x) < rootTol){
            return {x: xnew, iter: i + 1, res: "Converged"}
        }

        x = xnew
    }

    return {x: x, iter: maxIter, res: "Not Converged"}
}

function printResponse(start, end, step){
    let i = Number(start.toPrecision(5))

    while (i <= end) {
        let response = newtonRaphsonMethod(i, 1e-6, 1e-4, 100)
        let tr = `<tr><td>${i}</td><td>${response["x"]}</td><td>${response["iter"]}</td><td>${response["res"]}</td>`
        table.innerHTML += tr
        i = Number((i+step).toPrecision(5))
    }
}

printResponse(+sessionStorage.getItem("start"), +sessionStorage.getItem("end"), +sessionStorage.getItem("step"))