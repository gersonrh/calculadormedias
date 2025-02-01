function calcular() {
    // Obtener valores ingresados por el usuario
    let modelo = document.getElementById('modelo').value.trim();
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let pilotajeUSD = parseFloat(document.getElementById('pilotaje').value);

    // Validaciones: verificar que todos los valores sean números válidos y mayores a 0
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

    // Calcular el precio total de los bultos en Cochabamba con pilotaje
    let precioTotalBultosCBBAConPilotaje = precioVentaFinalCBBA * totalDocenas;

    // Calcular el precio total de los bultos en Cochabamba sin pilotaje
    let precioTotalBultosCBBASinPilotaje = (precioDocenaBOB * (1 + margen / 100)) * totalDocenas;

    // Calcular margen de ganancia por los 10 bultos
    let margenGanancia10Bultos = precioTotalBultosCBBAConPilotaje * (margen / 100);

    // Formatear números para mejor visualización
    let formatter = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });

    // Mostrar resultados con mejor formato
    let resultado = `
        <h2>Resumen para ${modelo}</h2>
        <p><strong>Cantidad de bultos comprados:</strong> ${cantidadBultos}</p>
        <p><strong>Precio total de los bultos en Cochabamba sin pilotaje:</strong> ${formatter.format(precioTotalBultosCBBASinPilotaje)}</p>
        <p><strong>Precio total de los bultos en Cochabamba con pilotaje:</strong> ${formatter.format(precioTotalBultosCBBAConPilotaje)}</p>
        <p><strong>Margen de ganancia por los 10 bultos:</strong> ${formatter.format(margenGanancia10Bultos)}</p>
        <p><strong>Precio base por docena:</strong> ${formatter.format(precioDocenaBOB)}</p>
        <p><strong>Precio con pilotaje:</strong> ${formatter.format(precioFinalDocenaTotal)}</p>
        <p><strong>Precio de venta en Cochabamba:</strong> ${formatter.format(precioVentaFinalCBBA)}</p>
    `;
    
    document.getElementById('resultado').innerHTML = resultado;
}
