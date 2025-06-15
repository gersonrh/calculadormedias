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

  crearNotaSection.style.display = 'block';
  verNotasSection.style.display = 'none';
});

// === Función para mostrar las notas guardadas ===
function displayNotes() {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    notesContainer.innerHTML = "<p>No hay notas guardadas.</p>";
    return;
  }

  notes.forEach((note, index) => {
    const noteHTML = `
      <div class="note-item">
        <p><strong>${index + 1}. Código:</strong> ${note.modelCode}</p>
        <p><strong>Nombre:</strong> ${note.modelName}</p>
        <p><strong>Precio de venta (docena con pilotaje + margen):</strong> ${note.docenaPriceWithMarginBOB} BOB</p>
        <p><strong>Precio bruto (docena con pilotaje sin margen):</strong> ${note.docenaPriceWithPilotageBOB} BOB</p>
        <button class="delete" onclick="deleteNote(${index})">Eliminar</button>
        <button class="details" onclick="viewDetails(${index})">Ver Detalles</button>
      </div>
      <hr>
    `;
    notesContainer.innerHTML += noteHTML;
  });
}

// === Eliminar nota individual ===
function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

// === Ver detalles completos de una nota ===
function viewDetails(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let note = notes[index];

  alert(`Detalles de la Nota:\nCódigo: ${note.modelCode}\nNombre: ${note.modelName}\nPrecio de docena con pilotaje (sin margen): ${note.docenaPriceWithPilotageBOB} BOB\nPrecio de docena con pilotaje + margen: ${note.docenaPriceWithMarginBOB} BOB\nPrecio de bulto con pilotaje (sin margen): ${note.packagePriceWithPilotageBOB} BOB\nPrecio de bulto con pilotaje + margen: ${note.packagePriceWithMarginBOB} BOB\nTotal revenue de todos los bultos (con margen): ${note.totalRevenueWithMarginBOB} BOB`);
}

// === Botones navegación ===
document.getElementById('crearNotaBtn').addEventListener('click', () => {
  crearNotaSection.style.display = 'block';
  verNotasSection.style.display = 'none';
});

document.getElementById('verNotasBtn').addEventListener('click', () => {
  crearNotaSection.style.display = 'none';
  verNotasSection.style.display = 'block';
  displayNotes();
});

// === Capturar submit y guardar nota ===
document.getElementById('createNoteForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const price = parseFloat(document.getElementById('price').value);
  const exchangeRate = parseFloat(document.getElementById('exchange').value);
  const numPackages = parseInt(document.getElementById('packages').value);
  const dozensPerPackage = parseInt(document.getElementById('dozens').value);
  const pilotage = parseFloat(document.getElementById('pilotage').value);
  const modelCode = document.getElementById('modelCode').value.trim();
  const modelName = document.getElementById('modelName').value.trim();
  const margin = parseFloat(document.getElementById('margin').value);

  if (isNaN(price) || isNaN(exchangeRate) || isNaN(numPackages) || isNaN(dozensPerPackage) ||
      isNaN(pilotage) || isNaN(margin) || !modelCode || !modelName ||
      price <= 0 || exchangeRate <= 0 || numPackages <= 0 || dozensPerPackage <= 0 || pilotage < 0 || margin < 0) {
    alert("Por favor, ingresa valores válidos en todos los campos.");
    return;
  }

  const pilotagePerDocenaUSD = pilotage / dozensPerPackage;
  const docenaPriceWithPilotageUSD = price + pilotagePerDocenaUSD;
  const docenaPriceWithPilotageBOB = docenaPriceWithPilotageUSD * exchangeRate;
  const docenaPriceWithMarginBOB = docenaPriceWithPilotageBOB * (1 + margin / 100);
  const packagePriceWithPilotageUSD = (price * dozensPerPackage) + pilotage;
  const packagePriceWithPilotageBOB = packagePriceWithPilotageUSD * exchangeRate;
  const packagePriceWithMarginBOB = packagePriceWithPilotageBOB * (1 + margin / 100);
  const totalRevenueWithMarginBOB = packagePriceWithMarginBOB * numPackages;

  const note = {
    modelCode,
    modelName,
    docenaPriceWithMarginBOB: docenaPriceWithMarginBOB.toFixed(2),
    docenaPriceWithPilotageBOB: docenaPriceWithPilotageBOB.toFixed(2),
    packagePriceWithPilotageBOB: packagePriceWithPilotageBOB.toFixed(2),
    packagePriceWithMarginBOB: packagePriceWithMarginBOB.toFixed(2),
    totalRevenueWithMarginBOB: totalRevenueWithMarginBOB.toFixed(2)
  };

  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));

  createNoteForm.reset();
}
