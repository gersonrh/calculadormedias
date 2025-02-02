function calcular() {
    // Obtener valores ingresados por el usuario
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let pilotajePorBultoUSD = parseFloat(document.getElementById('pilotaje').value);
    let cantidadBultos = parseInt(document.getElementById('cantidadBultos').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let margen = parseFloat(document.getElementById('margen').value);

    // Validaciones
    if (isNaN(precioPorDocenaUSD) || precioPorDocenaUSD <= 0 ||
        isNaN(docenasPorBulto) || docenasPorBulto <= 0 ||
        isNaN(pilotajePorBultoUSD) || pilotajePorBultoUSD < 0 ||
        isNaN(cantidadBultos) || cantidadBultos <= 0 ||
        isNaN(tasaCambio) || tasaCambio <= 0 ||
        isNaN(margen) || margen < 0) {
        alert("Por favor, ingresa valores válidos en todos los campos.");
        return;
    }

    // Cálculo del precio del bulto con pilotaje
    let precioBultoConPilotajeUSD = (precioPorDocenaUSD * docenasPorBulto) + pilotajePorBultoUSD;
    let precioBultoConPilotajeBOB = precioBultoConPilotajeUSD * tasaCambio;

    // Cálculo del precio de la docena en BOB con pilotaje
    let precioDocenaConPilotajeBOB = precioBultoConPilotajeBOB / docenasPorBulto;

    // Aplicar margen de ganancia
    let precioVentaDocenaConPilotajeBOB = precioDocenaConPilotajeBOB * (1 + margen / 100);

    // Cálculo del total de bultos con pilotaje
    let totalBultosConPilotaje = precioBultoConPilotajeBOB * cantidadBultos;
    let totalBultosConPilotajeYMargen = precioVentaDocenaConPilotajeBOB * docenasPorBulto * cantidadBultos;

    // Formatear números para mejor visualización
    let formatter = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });

    // Mostrar resultados (solo con pilotaje)
    let resultado = `
        <h2>Resultados</h2>
        <p><strong>Precio por Docena en BOB (Con Pilotaje):</strong> ${formatter.format(precioDocenaConPilotajeBOB)}</p>
        <p><strong>Precio de Venta por Docena (Con Pilotaje):</strong> ${formatter.format(precioVentaDocenaConPilotajeBOB)}</p>
        <p><strong>Total Bultos en BOB (Con Pilotaje):</strong> ${formatter.format(totalBultosConPilotaje)}</p>
        <p><strong>Total Bultos con Margen (Con Pilotaje):</strong> ${formatter.format(totalBultosConPilotajeYMargen)}</p>
    `;
    
    document.getElementById('resultado').innerHTML = resultado;
}
