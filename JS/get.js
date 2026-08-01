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

button.addEventListener("click", function() {
	let func = inputs[0].value;
	let start = +inputs[1].value;
	let end = +inputs[2].value;
	let step = +stepResult.innerText;
	let rootTol = +selects[0].value;
	let derivTol = +selects[1].value;
	let a = +stepA.value
	let b = +stepB.value

	validation = validateInput(func, start, end, a, b, step)

	if(!validation.isValid){
		err.textContent = validation.reason
	}else{
		err.textContent = ""

		sessionStorage.setItem("function", func);
		sessionStorage.setItem("start", start);
		sessionStorage.setItem("end", end);
		sessionStorage.setItem("step", step);
		sessionStorage.setItem("rootTol", rootTol);
		sessionStorage.setItem("derivTol", derivTol);

		window.location.href = "./table.html"
	}
})