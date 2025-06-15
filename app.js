// === Datos simulados extraídos desde factura (imagen) ===
let productosExtraidos = [];

// === Obtener tipo de cambio del dólar desde Binance ===
async function obtenerTipoCambioDolar() {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDTBOB");
    const data = await res.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error("Error al obtener tipo de cambio:", error);
    return 6.9; // valor de respaldo por defecto
  }
}

// === Insertar productos automáticamente al formulario ===
async function insertarProductosDesdeFactura(productos) {
  const exchangeRate = await obtenerTipoCambioDolar();
  const pilotajePorBulto = 37.5; // valor estimado fijo
  const margenGanancia = 30;

  for (const producto of productos) {
    document.getElementById('price').value = producto.precio_usd;
    document.getElementById('exchange').value = exchangeRate.toFixed(2);
    document.getElementById('packages').value = producto.bultos;
    document.getElementById('dozens').value = producto.docenas_por_bulto;
    document.getElementById('pilotage').value = pilotajePorBulto.toFixed(2);
    document.getElementById('modelCode').value = producto.modelCode;
    document.getElementById('modelName').value = producto.modelName;
    document.getElementById('margin').value = margenGanancia;

    document.getElementById('createNoteForm').dispatchEvent(new Event('submit'));
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

// === Botón para importar JSON manual desde GPT ===
function activarImportadorManual() {
  const input = prompt("Pega aquí el JSON de productosExtraidos que te dio ChatGPT:");
  try {
    const datos = JSON.parse(input);
    if (Array.isArray(datos)) {
      productosExtraidos = datos;
      insertarProductosDesdeFactura(productosExtraidos);
    } else {
      alert("El formato debe ser un arreglo JSON válido.");
    }
  } catch (e) {
    alert("Error al interpretar el JSON: " + e.message);
  }
}

// === Crear botón de importación e insertarlo en el DOM ===
window.addEventListener('load', () => {
  const nav = document.querySelector('nav');
  const botonImportar = document.createElement('button');
  botonImportar.textContent = "Importar desde ChatGPT";
  botonImportar.style.backgroundColor = '#2196F3';
  botonImportar.style.color = '#fff';
  botonImportar.style.marginLeft = '10px';
  botonImportar.onclick = activarImportadorManual;
  nav.appendChild(botonImportar);
});
