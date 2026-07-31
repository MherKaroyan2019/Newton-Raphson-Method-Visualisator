function printResponse(start, end, step, rootTol, derivTol){
    let i = roundToPrecision(start, 5)

    while (i <= end) {
        let response = newtonRaphsonMethod(i, derivTol, rootTol, 100).summary
        let tr = document.createElement("tr")
        let num = i
		
        tr.addEventListener("click", function () {
            sessionStorage["x0"] = num
            window.location.href = "./graph.html"
        })
        tr.innerHTML = `<td>${i}</td><td>${response["x"]}</td><td>${response["iter"]}</td><td>${response["res"]}`
        table.appendChild(tr)
        i = roundToPrecision(i + step, 5)
    }
}

printResponse(+sessionStorage.getItem("start"), +sessionStorage.getItem("end"), +sessionStorage.getItem("step"), +sessionStorage.getItem("rootTol"), +sessionStorage.getItem("derivTol"))