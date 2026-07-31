const parser = math.parser();
let button = document.getElementsByClassName("initial_data")[0];
let inputs = document.getElementsByClassName("inputs")[0].getElementsByTagName("input");
let selects = document.getElementsByClassName("inputs")[0].getElementsByTagName("select");
let stepA = document.getElementById("stepA")
let stepB = document.getElementById("stepB")
let stepResult = document.getElementById("stepResult")
let err = document.getElementById("err")

function updateStep(){
	let a = +stepA.value;
	let b = +stepB.value;

	const step = Math.pow(2, a) * Math.pow(5, b);

	stepResult.textContent = step;
}

stepA.addEventListener("input", updateStep);
stepB.addEventListener("input", updateStep);

function validateFunction(inputString) {
	try {
		const node = math.parse(inputString)

		const filtered = node.filter(n => n.isSymbolNode)
		const variables = [...new Set(filtered.map(n => n.name))]

		const hasInvalidVariables = variables.filter(name => {
			if (name == 'x'){ 
				return false
			}
			if (name in math){
				return false
			}
			return true
        })
		if (hasInvalidVariables.length != 0) {
			return { isValid: false, reason: `Function contains additional variables: ${variables.filter(v => v !== 'x').join(', ')}` }
		}

		const code = node.compile()
		const testResult = code.evaluate({ x: 1 })

		if (typeof testResult !== 'number' && !math.isBigNumber(testResult) && !math.isFraction(testResult) && !math.isComplex(testResult)) {
			return { isValid: false, reason: "Make sure your equation is valid and produces real numerical values" }
		}

		return { isValid: true, reason: ""}
	} catch (error) {
		return { isValid: false, reason: `Invalid Function` }
	}
}

button.addEventListener("click", function() {
	let func = inputs[0].value;
	let start = +inputs[1].value;
	let end = +inputs[2].value;
	let step = +stepResult.innerHTML;
	let rootTol = +selects[0].value;
	let derivTol = +selects[1].value;
	let a = +stepA.value
	let b = +stepB.value

	let validFunction = validateFunction(func)

	if(!validFunction.isValid){
		err.innerHTML = validFunction.reason
		return
	}else if(start < -1000 || start > 1000 || end < -1000 || end > 1000){
		err.innerHTML = "Starting and Ending initial guesses must be in interval from -1000 to 1000"
		return
	}else if(start > end){
		err.innerHTML = "Starting initial guess must be lower or equal to the Ending initial guess"
		return
	}else if(!Number.isInteger(a) || !Number.isInteger(b) || a < -5 || a > 5 || b < -5 || b > 5){
		err.innerHTML = "A and B must be integers in the range from -5 to 5"
		return
	}else if((end - start) / step > 1000){
		err.innerHTML = "The number of initial guesses must not be more than 1000"
		return
	}else{
		err.innerHTML = ""

		sessionStorage.setItem("function", func);
		sessionStorage.setItem("start", start);
		sessionStorage.setItem("end", end);
		sessionStorage.setItem("step", step);
		sessionStorage.setItem("rootTol", rootTol);
		sessionStorage.setItem("derivTol", derivTol);

		window.location.href = "./table.html"
	}
})