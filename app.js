// Almacenamos las notas en el LocalStorage
let notas = JSON.parse(localStorage.getItem('notas')) || [];

function calcular() {
    // Obtener valores ingresados por el usuario
    let modelo = document.getElementById('modelo').value.trim();
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let pilotajeUSD = parseFloat(document.getElementById('pilotajeIquique').value);

    // Validaciones
    if (!modelo || isNaN(precioPorDocenaUSD) || precioPorDocenaUSD <= 0 ||
        isNaN(tasaCambio) || tasaCambio <= 0 ||
        isNaN(docenasPorBulto) || docenasPorBulto <= 0 ||
        isNaN(cantidadBultos) || cantidadBultos <= 0 ||
        isNaN(margen) || margen < 0 ||
        isNaN(pilotajeUSD) || pilotajeUSD < 0) {

        alert("Por favor, ingresa valores válidos en todos los campos.");
        return;
    }

    // Calcular el total de docenas compradas
    let totalDocenas = cantidadBultos * docenasPorBulto;

    // Convertir el precio base de cada docena a BOB
    let precioDocenaBOB = precioPorDocenaUSD * tasaCambio;

    // Calcular el costo adicional del pilotaje por cada docena
    let costoPilotajePorDocena = (pilotajeUSD / totalDocenas) * tasaCambio;

    // Precio final por docena sumando el pilotaje
    let precioFinalDocenaTotal = precioDocenaBOB + costoPilotajePorDocena;

    // Aplicar margen de ganancia
    let precioVentaFinalCBBA = precioFinalDocenaTotal * (1 + margen / 100);

    // Calcular el precio total de los bultos con pilotaje
    let precioTotalBultosCBBAConPilotaje = precioVentaFinalCBBA * totalDocenas;

    // Mostrar resultados
    let resultado = `
        <h2>Resumen para ${modelo}</h2>
        <p><strong>Cantidad de bultos comprados:</strong> ${cantidadBultos}</p>
        <p><strong>Precio por docena (con pilotaje):</strong> ${precioFinalDocenaTotal.toFixed(2)} BOB</p>
        <p><strong>Precio por docena con margen de ganancia:</strong> ${precioVentaFinalCBBA.toFixed(2)} BOB</p>
        <p><strong>Precio total de los bultos con pilotaje:</strong> ${precioTotalBultosCBBAConPilotaje.toFixed(2)} BOB</p>
    `;

    // Mostrar resultado en la interfaz
    document.getElementById('resultado').innerHTML = resultado;
}

function guardarNota() {
    let modelo = document.getElementById('modelo').value.trim();
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let pilotajeUSD = parseFloat(document.getElementById('pilotajeIquique').value);

    // Validación
    if (!modelo || isNaN(precioPorDocenaUSD) || precioPorDocenaUSD <= 0 ||
        isNaN(tasaCambio) || tasaCambio <= 0 ||
        isNaN(docenasPorBulto) || docenasPorBulto <= 0 ||
        isNaN(cantidadBultos) || cantidadBultos <= 0 ||
        isNaN(margen) || margen < 0 ||
        isNaN(pilotajeUSD) || pilotajeUSD < 0) {

        alert("Por favor, ingresa valores válidos en todos los campos.");
        return;
    }

    // Calcular detalles para la nota
    let totalDocenas = cantidadBultos * docenasPorBulto;
    let precioDocenaBOB = precioPorDocenaUSD * tasaCambio;
    let costoPilotajePorDocena = (pilotajeUSD / totalDocenas) * tasaCambio;
    let precioFinalDocenaTotal = precioDocenaBOB + costoPilotajePorDocena;
    let precioVentaFinalCBBA = precioFinalDocenaTotal * (1 + margen / 100);

    // Crear una nota
    let nota = {
        modelo: modelo,
        cantidadBultos: cantidadBultos,
        precioDocenaSinMargen: precioDocenaBOB.toFixed(2),
        precioDocenaConMargen: precioVentaFinalCBBA.toFixed(2),
        precioTotalBultosConPilotaje: (precioVentaFinalCBBA * totalDocenas).toFixed(2),
    };

    // Guardar la nota en el LocalStorage
    notas.push(nota);
    localStorage.setItem('notas', JSON.stringify(notas));

    // Actualizar la lista de notas guardadas
    mostrarNotas();
}

function mostrarNotas() {
    let listaNotas = document.getElementById('notasGuardadas');
    listaNotas.innerHTML = '';

    notas.forEach((nota, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <strong>Código:</strong> ${index + 1} |
            <strong>Modelo:</strong> ${nota.modelo} |
            <strong>Precio Docena sin margen:</strong> ${nota.precioDocenaSinMargen} BOB |
            <strong>Precio Docena con margen:</strong> ${nota.precioDocenaConMargen} BOB |
            <button onclick="eliminarNota(${index})">Eliminar</button> |
            <button onclick="verDetalles(${index})">Ver Detalles</button>
        `;
        listaNotas.appendChild(li);
    });
}

function eliminarNota(index) {
    // Eliminar nota del array y actualizar el LocalStorage
    notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(notas));
    mostrarNotas();
}

function verDetalles(index) {
    let nota = notas[index];
    alert(`
        Modelo: ${nota.modelo}\n
        Precio Docena sin Margen: ${nota.precioDocenaSinMargen} BOB\n
        Precio Docena con Margen: ${nota.precioDocenaConMargen} BOB\n
        Precio Total de los Bultos con Pilotaje: ${nota.precioTotalBultosConPilotaje} BOB
    `);
}

// Mostrar las notas guardadas al cargar la página
mostrarNotas();
