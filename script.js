const display = document.getElementById("display");
const displayTop = document.getElementById("display-top");

let current = "";
let operator = null;
let previous = "";

// Función para actualizar display principal
function updateDisplay(value) {
    display.textContent = value;
}

// Actualizar display superior
function updateTop() {
    if (operator) {
        displayTop.textContent = `${previous} ${operator}`;
    } else {
        displayTop.textContent = "";
    }
}

document.querySelectorAll(".num").forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.textContent;

        if (current === "0") current = value;
        else current += value;

        updateDisplay(current);
    });
});

document.querySelectorAll("[data-operator]").forEach(btn => {
    btn.addEventListener("click", () => {
        if (current === "") return;

        if (previous !== "") {
            previous = eval(previous + operator + current);
        } else {
            previous = current;
        }

        operator = btn.getAttribute("data-operator");
        current = "";

        updateDisplay(previous);
        updateTop(); // 👈 mostrar operación arriba
    });
});

document.querySelector(".equal").addEventListener("click", () => {
    if (current === "" || operator === null) return;

    const result = eval(previous + operator + current);

    // mostrar operación final completa arriba
    displayTop.textContent = `${previous} ${operator} ${current} =`;

    updateDisplay(result);

    previous = result;
    current = "";
    operator = null;
});

document.querySelector("[data-action='clear']").addEventListener("click", () => {
    current = "";
    previous = "";
    operator = null;
    updateDisplay("0");
    displayTop.textContent = "";
});

document.querySelector("[data-action='delete']").addEventListener("click", () => {
    current = current.slice(0, -1);
    updateDisplay(current || "0");
});
