function calcular() {
    // Obtener valores ingresados por el usuario
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let pilotajePorBultoUSD = parseFloat(document.getElementById('pilotajeBulto').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let cantidadBultos = parseInt(document.getElementById('cantidad').value);

    // Validaciones: verificar que todos los valores sean números válidos
    if (isNaN(precioPorDocenaUSD) || isNaN(docenasPorBulto) || isNaN(pilotajePorBultoUSD) ||
        isNaN(tasaCambio) || isNaN(margen) || isNaN(cantidadBultos) ||
        precioPorDocenaUSD <= 0 || docenasPorBulto <= 0 || tasaCambio <= 0 || cantidadBultos <= 0) {

        alert("Por favor, ingresa valores válidos en todos los campos.");
        return;
    }

    // Calcular el precio total de un bulto en USD
    let precioBultoUSD = (precioPorDocenaUSD * docenasPorBulto) + pilotajePorBultoUSD;

    // Convertir a BOB
    let precioBultoBOB = precioBultoUSD * tasaCambio;

    // Precio por docena con pilotaje en BOB
    let precioDocenaConPilotajeBOB = precioBultoBOB / docenasPorBulto;

    // Aplicar margen de ganancia
    let precioVentaDocenaBOB = precioDocenaConPilotajeBOB * (1 + margen / 100);
    let precioVentaBultoBOB = precioVentaDocenaBOB * docenasPorBulto;
    let precioVentaTotalBultosBOB = precioVentaBultoBOB * cantidadBultos;

    // Ganancia neta por docena y por bulto en BOB
    let gananciaNetaDocenaBOB = precioVentaDocenaBOB - precioDocenaConPilotajeBOB;
    let gananciaNetaBultoBOB = precioVentaBultoBOB - precioBultoBOB;
    let gananciaTotalBOB = gananciaNetaBultoBOB * cantidadBultos;

    // Convertir las ganancias a USD
    let precioVentaDocenaUSD = precioVentaDocenaBOB / tasaCambio;
    let precioVentaBultoUSD = precioVentaBultoBOB / tasaCambio;
    let precioVentaTotalBultosUSD = precioVentaTotalBultosBOB / tasaCambio;
    let gananciaNetaDocenaUSD = gananciaNetaDocenaBOB / tasaCambio;
    let gananciaNetaBultoUSD = gananciaNetaBultoBOB / tasaCambio;
    let gananciaTotalUSD = gananciaTotalBOB / tasaCambio;

    // Formatear números para mejor visualización
    let formatterBOB = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });
    let formatterUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

    // Mostrar resultados
    let resultado = `
        <h2>Resultados</h2>
        <p><strong>Precio por docena con pilotaje:</strong> ${formatterBOB.format(precioDocenaConPilotajeBOB)} (${formatterUSD.format(precioDocenaConPilotajeBOB / tasaCambio)})</p>
        <p><strong>Precio de venta por docena:</strong> ${formatterBOB.format(precioVentaDocenaBOB)} (${formatterUSD.format(precioVentaDocenaUSD)})</p>
        <p><strong>Precio de venta por bulto:</strong> ${formatterBOB.format(precioVentaBultoBOB)} (${formatterUSD.format(precioVentaBultoUSD)})</p>
        <p><strong>Precio total de todos los bultos:</strong> ${formatterBOB.format(precioVentaTotalBultosBOB)} (${formatterUSD.format(precioVentaTotalBultosUSD)})</p>
        <hr>
        <h3>Ganancias netas</h3>
        <p><strong>Ganancia neta por docena:</strong> ${formatterBOB.format(gananciaNetaDocenaBOB)} (${formatterUSD.format(gananciaNetaDocenaUSD)})</p>
        <p><strong>Ganancia neta por bulto:</strong> ${formatterBOB.format(gananciaNetaBultoBOB)} (${formatterUSD.format(gananciaNetaBultoUSD)})</p>
        <p><strong>Ganancia total por todos los bultos:</strong> ${formatterBOB.format(gananciaTotalBOB)} (${formatterUSD.format(gananciaTotalUSD)})</p>
    `;

    document.getElementById('resultado').innerHTML = resultado;
}
