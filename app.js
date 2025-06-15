// === CÃ³digo base original restaurado con botÃ³n de importaciÃ³n desde ChatGPT ===

const crearNotaBtn = document.getElementById('crearNotaBtn');
const verNotasBtn = document.getElementById('verNotasBtn');
const crearNotaSection = document.getElementById('crearNotaSection');
const verNotasSection = document.getElementById('verNotasSection');
const createNoteForm = document.getElementById('createNoteForm');
const calculationResult = document.getElementById('calculationResult');
const notesContainer = document.getElementById('notesContainer');

crearNotaBtn.addEventListener('click', () => {
  crearNotaSection.style.display = 'block';
  verNotasSection.style.display = 'none';
});

verNotasBtn.addEventListener('click', () => {
  crearNotaSection.style.display = 'none';
  verNotasSection.style.display = 'block';
  displayNotes();
});

createNoteForm.addEventListener('submit', (e) => {
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
    alert("Por favor, ingresa valores vÃ¡lidos en todos los campos.");
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
});

displayNotes = () => {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesContainer.innerHTML = "";

  if (notes.length === 0) {
    notesContainer.innerHTML = "<p>No hay notas guardadas.</p>";
    return;
  }

  notes.forEach((note, index) => {
    const noteHTML = `
      <div class="note-item">
        <p><strong>${index + 1}. CÃ³digo:</strong> ${note.modelCode}</p>
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

deleteNote = (index) => {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

viewDetails = (index) => {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let note = notes[index];

  alert(`Detalles de la Nota:
CÃ³digo: ${note.modelCode}
Nombre: ${note.modelName}
Precio de docena con pilotaje (sin margen): ${note.docenaPriceWithPilotageBOB} BOB
Precio de docena con pilotaje + margen: ${note.docenaPriceWithMarginBOB} BOB
Precio de bulto con pilotaje (sin margen): ${note.packagePriceWithPilotageBOB} BOB
Precio de bulto con pilotaje + margen: ${note.packagePriceWithMarginBOB} BOB
Total revenue de todos los bultos (con margen): ${note.totalRevenueWithMarginBOB} BOB`);
}

window.onload = function() {
  crearNotaSection.style.display = 'block';
  verNotasSection.style.display = 'none';

  const nav = document.querySelector('nav');
  const botonImportar = document.createElement('button');
  botonImportar.textContent = "Importar desde ChatGPT";
  botonImportar.style.backgroundColor = '#2196F3';
  botonImportar.style.color = '#fff';
  botonImportar.style.marginLeft = '10px';
  botonImportar.onclick = () => {
    const input = prompt("Pega aquÃ­ el JSON de productosExtraidos que te dio ChatGPT:");
    try {
      const datos = JSON.parse(input);
      if (Array.isArray(datos)) {
        insertarProductosDesdeFactura(datos);
      } else {
        alert("El formato debe ser un arreglo JSON vÃ¡lido.");
      }
    } catch (e) {
      alert("Error al interpretar el JSON: " + e.message);
    }
  };
  nav.appendChild(botonImportar);
}

insertarProductosDesdeFactura = async (productos) => {
  const exchangeRate = await obtenerTipoCambioDolar();
  const pilotajePorBulto = 37.5;
  const margen = 30;

  for (const producto of productos) {
    document.getElementById('price').value = producto.precio_usd;
    document.getElementById('exchange').value = exchangeRate.toFixed(2);
    document.getElementById('packages').value = producto.bultos;
    document.getElementById('dozens').value = producto.docenas_por_bulto;
    document.getElementById('pilotage').value = pilotajePorBulto;
    document.getElementById('modelCode').value = producto.modelCode;
    document.getElementById('modelName').value = producto.modelName;
    document.getElementById('margin').value = margen;

    createNoteForm.dispatchEvent(new Event('submit'));
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

obtenerTipoCambioDolar = async () => {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=USDTBOB");
    const data = await res.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error("Error al obtener tipo de cambio:", error);
    return 6.9;
  }
};
