// -------------------------------
// VARIABLES GLOBALES
// -------------------------------

let especialidades = [];
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// -------------------------------
// INICIO
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
    cargarEspecialidades();
    mostrarReservas();
});

// -------------------------------
// CARGAR ESPECIALIDADES DESDE JSON
// -------------------------------

function cargarEspecialidades() {
    fetch("./data/especialidades.json")
        .then(res => res.json())
        .then(data => {
            especialidades = data;
            renderEspecialidades(data);
        })
        .catch(err => console.error("Error cargando JSON:", err));
}

// -------------------------------
// RENDER DE ESPECIALIDADES
// -------------------------------

function renderEspecialidades(lista) {
    const contenedor = document.getElementById("contenedor-especialidades");
    contenedor.innerHTML = "";

    lista.forEach(esp => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <h3>${esp.especialidad}</h3>
            <button onclick="mostrarTurnos(${esp.id})">Ver turnos</button>
        `;
        contenedor.appendChild(card);
    });
}

// -------------------------------
// MOSTRAR TURNOS DISPONIBLES
// -------------------------------

function mostrarTurnos(idEspecialidad) {
    const especialidad = especialidades.find(e => e.id === idEspecialidad);
    const contenedor = document.getElementById("contenedor-turnos");

    contenedor.innerHTML = `<h3>${especialidad.especialidad}</h3>`;

    especialidad.turnos.forEach(horario => {
        // Revisar si el turno ya fue tomado
        const ocupado = reservas.some(r => r.especialidad === especialidad.especialidad && r.hora === horario);

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <p>${horario}</p>
            <button ${ocupado ? "disabled" : ""} onclick="reservar('${especialidad.especialidad}', '${horario}')">
                ${ocupado ? "Ocupado" : "Reservar"}
            </button>
        `;

        contenedor.appendChild(card);
    });
}

// -------------------------------
// RESERVAR UN TURNO
// -------------------------------

function reservar(especialidad, horario) {

    Swal.fire({
        title: "Reservar turno",
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre">
            <input id="apellido" class="swal2-input" placeholder="Apellido">
            <input id="dni" class="swal2-input" placeholder="DNI">
            <input id="email" class="swal2-input" placeholder="Email">
        `,
        confirmButtonText: "Confirmar",
        focusConfirm: false,
        preConfirm: () => {
            return {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                dni: document.getElementById("dni").value,
                email: document.getElementById("email").value
            };
        }
    }).then(result => {
        if (!result.value.nombre || !result.value.apellido || !result.value.dni) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return;
        }

        const nuevaReserva = {
            id: Date.now(),
            especialidad,
            hora: horario,
            ...result.value
        };

        reservas.push(nuevaReserva);
        localStorage.setItem("reservas", JSON.stringify(reservas));

        Swal.fire("¡Hecho!", "Turno reservado correctamente", "success");
        mostrarTurnos(especialidades.find(e => e.especialidad === especialidad).id);
        mostrarReservas();
    });
}

// -------------------------------
// MOSTRAR MIS RESERVAS
// -------------------------------

function mostrarReservas() {
    const contenedor = document.getElementById("contenedor-reservas");
    contenedor.innerHTML = "";

    reservas.forEach(reserva => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <p><strong>${reserva.especialidad}</strong></p>
            <p>${reserva.nombre} ${reserva.apellido}</p>
            <p>${reserva.hora}</p>
            <button onclick="cancelar(${reserva.id})">Cancelar</button>
        `;

        contenedor.appendChild(card);
    });
}

// -------------------------------
// CANCELAR RESERVA
// -------------------------------

function cancelar(id) {
    Swal.fire({
        title: "¿Cancelar turno?",
        showCancelButton: true,
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No"
    }).then(res => {
        if (res.isConfirmed) {
            reservas = reservas.filter(r => r.id !== id);
            localStorage.setItem("reservas", JSON.stringify(reservas));
            mostrarReservas();
            Swal.fire("Cancelado", "El turno fue cancelado", "success");
        }
    });
}
