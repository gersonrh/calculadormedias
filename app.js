function calcular() {
    // Obtener valores ingresados por el usuario
    let modelo = document.getElementById('modelo').value.trim();
    let nombre = document.getElementById('nombre').value.trim();
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let pilotajeUSD = parseFloat(document.getElementById('pilotaje').value);

    // Validaciones: verificar que todos los valores sean números válidos y mayores a 0
    if (!modelo || !nombre || isNaN(precioPorDocenaUSD) || precioPorDocenaUSD <= 0 ||
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

    // Calcular el precio total de los bultos en Cochabamba con pilotaje
    let precioTotalBultosCBBAConPilotaje = precioVentaFinalCBBA * totalDocenas;

    // Formatear números para mejor visualización
    let formatter = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });

    // Mostrar resultados con mejor formato
    let resultado = `
        <h2>Resumen para ${modelo}</h2>
        <p><strong>Nombre del modelo:</strong> ${nombre}</p>
        <p><strong>Cantidad de bultos comprados:</strong> ${cantidadBultos}</p>
        <p><strong>Precio de la docena sin margen en BOB:</strong> ${formatter.format(precioDocenaBOB)}</p>
        <p><strong>Precio de la docena con pilotaje y sin margen en BOB:</strong> ${formatter.format(precioFinalDocenaTotal)}</p>
        <p><strong>Precio de la docena con margen de ganancia en BOB:</strong> ${formatter.format(precioVentaFinalCBBA)}</p>
        <p><strong>Precio total de los bultos con pilotaje en Cochabamba:</strong> ${formatter.format(precioTotalBultosCBBAConPilotaje)}</p>
    `;
    
    document.getElementById('resultado').innerHTML = resultado;

    // Guardar en LocalStorage (opcional)
    guardarNota(modelo, nombre, precioPorDocenaUSD, tasaCambio, docenasPorBulto, cantidadBultos, margen, pilotajeUSD);
}

// Función para guardar la nota en LocalStorage
function guardarNota(modelo, nombre, precioPorDocenaUSD, tasaCambio, docenasPorBulto, cantidadBultos, margen, pilotajeUSD) {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    let totalDocenas = cantidadBultos * docenasPorBulto;
    let precioDocenaBOB = precioPorDocenaUSD * tasaCambio;
    let costoPilotajePorDocena = (pilotajeUSD / totalDocenas) * tasaCambio;
    let precioFinalDocenaTotal = precioDocenaBOB + costoPilotajePorDocena;
    let precioVentaFinalCBBA = precioFinalDocenaTotal * (1 + margen / 100);

    let nota = {
        codigo: modelo,
        nombre: nombre,
        precioDocena: precioDocenaBOB,
        precioDocenaConPilotaje: precioFinalDocenaTotal,
        precioDocenaConMargen: precioVentaFinalCBBA
    };

    // Guardar la nueva nota en el array
    notas.push(nota);

    // Guardar el array actualizado en LocalStorage
    localStorage.setItem("notas", JSON.stringify(notas));

    // Actualizar la vista de notas
    mostrarNotas();
}

// Función para mostrar todas las notas guardadas
function mostrarNotas() {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    let listaNotas = document.getElementById('nota-lista');
    listaNotas.innerHTML = '';

    notas.forEach((nota, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <p><strong>Codigo:</strong> ${nota.codigo} <strong>Nombre:</strong> ${nota.nombre}</p>
            <p><strong>Precio por docena con margen (en BOB):</strong> ${new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(nota.precioDocenaConMargen)}</p>
            <button onclick="eliminarNota(${index})">Eliminar</button>
        `;
        listaNotas.appendChild(li);
    });
}

// Función para eliminar una nota
function eliminarNota(index) {
    let notas = JSON.parse(localStorage.getItem("notas")) || [];
    notas.splice(index, 1);
    localStorage.setItem("notas", JSON.stringify(notas));
    mostrarNotas();
}

// Cargar las notas al iniciar la página
window.onload = mostrarNotas;
