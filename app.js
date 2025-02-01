function calcular() {
    // Obtener valores ingresados por el usuario
    let modelo = document.getElementById('modelo').value;
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let pilotajeIquiqueUSD = parseFloat(document.getElementById('pilotajeIquique').value);
    let pilotajeOruroUSD = parseFloat(document.getElementById('pilotajeOruro').value);

    // Calcular el total de docenas compradas
    let totalDocenas = cantidadBultos * docenasPorBulto;

    // Convertir el precio base de cada docena a BOB
    let precioDocenaBOB = precioPorDocenaUSD * tasaCambio;

    // Calcular el costo adicional del pilotaje por cada docena
    let costoPilotajePorDocenaIquique = (pilotajeIquiqueUSD / totalDocenas) * tasaCambio;
    let costoPilotajePorDocenaOruro = (pilotajeOruroUSD / totalDocenas) * tasaCambio;

    // Precio final por docena sumando ambos pilotajes
    let precioFinalDocenaTotal = precioDocenaBOB + costoPilotajePorDocenaIquique + costoPilotajePorDocenaOruro;

    // Aplicar margen de ganancia
    let precioVentaFinalCBBA = precioFinalDocenaTotal * (1 + margen / 100);

    // Mostrar resultados
    let resultado = `
        <h2>Resumen para ${modelo}</h2>
        <p>Precio base por docena: ${precioDocenaBOB.toFixed(2)} BOB</p>
        <p>Precio con pilotaje Iquique: ${(precioDocenaBOB + costoPilotajePorDocenaIquique).toFixed(2)} BOB</p>
        <p>Precio con pilotaje Oruro: ${(precioDocenaBOB + costoPilotajePorDocenaOruro).toFixed(2)} BOB</p>
        <p><strong>Precio total por docena (Iquique + Oruro): ${precioFinalDocenaTotal.toFixed(2)} BOB</strong></p>
        <p><strong>Precio de venta en Cochabamba: ${precioVentaFinalCBBA.toFixed(2)} BOB</strong></p>
    `;
    document.getElementById('resultado').innerHTML = resultado;
}