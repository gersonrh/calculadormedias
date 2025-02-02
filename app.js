function calcular() {
    // Obtener valores ingresados por el usuario
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let docenasPorBulto = parseInt(document.getElementById('docenas').value);
    let pilotajePorBultoUSD = parseFloat(document.getElementById('pilotaje').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let margen = parseFloat(document.getElementById('margen').value);
    let cantidadBultos = parseInt(document.getElementById('cantidadBultos').value);

    // Validar si los valores son correctos
    if (isNaN(precioPorDocenaUSD) || isNaN(docenasPorBulto) || isNaN(pilotajePorBultoUSD) ||
        isNaN(tasaCambio) || isNaN(margen) || isNaN(cantidadBultos) ||
        precioPorDocenaUSD <= 0 || docenasPorBulto <= 0 || tasaCambio <= 0 || cantidadBultos <= 0) {
        alert("Por favor, ingresa valores válidos.");
        return;
    }

    // Mostrar en consola los valores ingresados (para depuración)
    console.log("Precio Docena USD:", precioPorDocenaUSD);
    console.log("Docenas por Bulto:", docenasPorBulto);
    console.log("Pilotaje por Bulto USD:", pilotajePorBultoUSD);
    console.log("Tasa de Cambio:", tasaCambio);
    console.log("Margen de Ganancia (%):", margen);
    console.log("Cantidad de Bultos:", cantidadBultos);

    // Calcular el costo total del bulto con pilotaje
    let precioBultoUSD = (precioPorDocenaUSD * docenasPorBulto) + pilotajePorBultoUSD;
    let precioBultoBOB = precioBultoUSD * tasaCambio;

    // Calcular el precio por docena en BOB con pilotaje
    let precioDocenaBOB = precioBultoBOB / docenasPorBulto;

    // Aplicar margen de ganancia
    let precioDocenaVentaBOB = precioDocenaBOB * (1 + margen / 100);
    let precioBultoVentaBOB = precioBultoBOB * (1 + margen / 100);

    // Calcular la ganancia neta
    let gananciaPorDocenaBOB = precioDocenaVentaBOB - precioDocenaBOB;
    let gananciaPorBultoBOB = precioBultoVentaBOB - precioBultoBOB;
    let gananciaTotalBOB = gananciaPorBultoBOB * cantidadBultos;

    // Convertir los valores a USD
    let precioDocenaVentaUSD = precioDocenaVentaBOB / tasaCambio;
    let precioBultoVentaUSD = precioBultoVentaBOB / tasaCambio;
    let gananciaPorDocenaUSD = gananciaPorDocenaBOB / tasaCambio;
    let gananciaPorBultoUSD = gananciaPorBultoBOB / tasaCambio;
    let gananciaTotalUSD = gananciaTotalBOB / tasaCambio;

    // Formatear números
    let formatterBOB = new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });
    let formatterUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

    // Mostrar resultados en la página
    let resultado = `
        <h2>Resultados</h2>
        <p><strong>Precio de la docena en BOB:</strong> ${formatterBOB.format(precioDocenaBOB)}</p>
        <p><strong>Precio de la docena con margen en BOB:</strong> ${formatterBOB.format(precioDocenaVentaBOB)}</p>
        <p><strong>Precio de la docena con margen en USD:</strong> ${formatterUSD.format(precioDocenaVentaUSD)}</p>
        <p><strong>Precio del bulto con pilotaje en BOB:</strong> ${formatterBOB.format(precioBultoBOB)}</p>
        <p><strong>Precio del bulto con margen en BOB:</strong> ${formatterBOB.format(precioBultoVentaBOB)}</p>
        <p><strong>Precio del bulto con margen en USD:</strong> ${formatterUSD.format(precioBultoVentaUSD)}</p>
        <p><strong>Ganancia por docena en BOB:</strong> ${formatterBOB.format(gananciaPorDocenaBOB)}</p>
        <p><strong>Ganancia por docena en USD:</strong> ${formatterUSD.format(gananciaPorDocenaUSD)}</p>
        <p><strong>Ganancia por bulto en BOB:</strong> ${formatterBOB.format(gananciaPorBultoBOB)}</p>
        <p><strong>Ganancia por bulto en USD:</strong> ${formatterUSD.format(gananciaPorBultoUSD)}</p>
        <p><strong>Ganancia total por todos los bultos en BOB:</strong> ${formatterBOB.format(gananciaTotalBOB)}</p>
        <p><strong>Ganancia total por todos los bultos en USD:</strong> ${formatterUSD.format(gananciaTotalUSD)}</p>
    `;

    document.getElementById('resultado').innerHTML = resultado;
}
