const parser = math.parser();
let button = document.getElementsByClassName("initial_data")[0];
let inputs = document.getElementsByClassName("inputs")[0].getElementsByTagName("input");

button.addEventListener("click", function() {
    func = inputs[0].value;
    start = inputs[1].value;
    end = inputs[2].value;
    step = inputs[3].value;

    sessionStorage.setItem("function", func);
    sessionStorage.setItem("start", start);
    sessionStorage.setItem("end", end);
    sessionStorage.setItem("step", step);

    window.location.href = "./table.html"
})