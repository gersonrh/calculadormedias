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

    // Calcular el precio de cada docena en BOB (sin margen)
    let precioDocenaBOB = precioPorDocenaUSD * tasaCambio;

    // Calcular el costo adicional del pilotaje por cada docena
    let costoPilotajePorDocena = (pilotajeUSD / totalDocenas) * tasaCambio;

    // Precio final por docena sumando el pilotaje
    let precioFinalDocenaTotal = precioDocenaBOB + costoPilotajePorDocena;

    // Precio de la docena con margen de ganancia
    let precioVentaFinalConMargen = precioFinalDocenaTotal * (1 + margen / 100);

    // Mostrar resultados con mejor formato
    let formatter = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });

    let resultado = `
        <h2>Resumen para ${modelo}</h2>
        <p><strong>Nombre del modelo:</strong> ${nombre}</p>
        <p><strong>Cantidad de bultos comprados:</strong> ${cantidadBultos}</p>
        <p><strong>Precio por docena sin margen en BOB:</strong> ${formatter.format(precioDocenaBOB)}</p>
        <p><strong>Precio por docena con pilotaje (sin margen) en BOB:</strong> ${formatter.format(precioFinalDocenaTotal)}</p>
        <p><strong>Precio de la docena con margen de ganancia en BOB:</strong> ${formatter.format(precioVentaFinalConMargen)}</p>
    `;
    
    document.getElementById('resultado').innerHTML = resultado;

    // Guardar en LocalStorage (opcional)
    guardarNota(modelo, nombre, precioPorDocenaUSD, tasaCambio, docenasPorBulto, cantidadBultos, margen, pilotajeUSD);
}
