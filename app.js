function mostrarFormulario() {
    document.getElementById("formulario").style.display = "block";
    document.getElementById("notasGuardadas").style.display = "none";
    document.getElementById("menu").style.display = "block";
}

function mostrarNotas() {
    document.getElementById("formulario").style.display = "none";
    document.getElementById("notasGuardadas").style.display = "block";
    document.getElementById("menu").style.display = "none";
    cargarNotasGuardadas();
}

function cargarNotasGuardadas() {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    let notasListadas = document.getElementById("notasListadas");
    notasListadas.innerHTML = "";

    if (notas.length === 0) {
        notasListadas.innerHTML = "<p>No hay notas guardadas.</p>";
    } else {
        notas.forEach((nota, index) => {
            let notaDiv = document.createElement("div");
            notaDiv.classList.add("notas-lista-item");
            notaDiv.innerHTML = `
                <div><strong>Nombre:</strong> ${nota.nombre} <strong>Código:</strong> ${nota.codigo}</div>
                <div><strong>Precio con margen:</strong> ${nota.precioConMargen} BOB</div>
                <button onclick="eliminarNota(${index})">Eliminar</button>
            `;
            notasListadas.appendChild(notaDiv);
        });
    }
}

function eliminarNota(index) {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(notas));
    cargarNotasGuardadas();
}

function calcular() {
    // Obtener los valores de los inputs
    let nombre = document.getElementById('nombre').value.trim();
    let codigo = document.getElementById('codigo').value.trim();
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let pilotajeUSD = parseFloat(document.getElementById('pilotaje').value);

    // Validar los datos de entrada
    if (!nombre || !codigo || isNaN(precioPorDocenaUSD) || precioPorDocenaUSD <= 0 ||
        isNaN(tasaCambio) || tasaCambio <= 0 || isNaN(docenasPorBulto) || docenasPorBulto <= 0 ||
        isNaN(cantidadBultos) || cantidadBultos <= 0 || isNaN(margen) || margen < 0 || isNaN(pilotajeUSD) || pilotajeUSD < 0) {
        alert("Por favor, ingresa valores válidos en todos los campos.");
        return;
    }

    // Calcular el precio por docena sin pilotaje en BOB
    let precioDocenaBOB = precioPorDocenaUSD * tasaCambio;

    // Calcular el costo de pilotaje por bulto
    let costoPilotajePorBulto = pilotajeUSD * tasaCambio;

    // Calcular el precio por bulto con pilotaje
    let precioBultoConPilotajeBOB = (precioDocenaBOB * docenasPorBulto) + costoPilotajePorBulto;

    // Calcular el precio por docena con pilotaje
    let precioDocenaConPilotajeBOB = precioBultoConPilotajeBOB / docenasPorBulto;

    // Calcular el precio con margen de ganancia
    let precioDocenaConMargenBOB = precioDocenaConPilotajeBOB * (1 + margen / 100);

    // Guardar la nota
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.push({
        nombre: nombre,
        codigo: codigo,
        precioConMargen: precioDocenaConMargenBOB.toFixed(2)
    });
