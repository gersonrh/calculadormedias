// Referencias a elementos
const crearNotaBtn = document.getElementById('crearNotaBtn');
const verNotasBtn = document.getElementById('verNotasBtn');
const crearNotaSection = document.getElementById('crearNotaSection');
const verNotasSection = document.getElementById('verNotasSection');
const createNoteForm = document.getElementById('createNoteForm');
const calculationResult = document.getElementById('calculationResult');
const notesContainer = document.getElementById('notesContainer');

// Navegación entre secciones
crearNotaBtn.addEventListener('click', () => {
  crearNotaSection.style.display = 'block';
  verNotasSection.style.display = 'none';
});

verNotasBtn.addEventListener('click', () => {
  crearNotaSection.style.display = 'none';
  verNotasSection.style.display = 'block';
  displayNotes();
});

// Al enviar el formulario, se realizan los cálculos y se guarda la nota
createNoteForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Obtener valores de entrada
  const price = parseFloat(document.getElementById('price').value);              // Precio de docena en USD
  const exchangeRate = parseFloat(document.getElementById('exchange').value);     // Valor del dólar en BOB
  const numPackages = parseInt(document.getElementById('packages').value);        // Cantidad de bultos
  const dozensPerPackage = parseInt(document.getElementById('dozens').value);     // Docenas por bulto
  const pilotage = parseFloat(document.getElementById('pilotage').value);         // Pilotaje por bulto en USD
  const modelCode = document.getElementById('modelCode').value.trim();            // Código del modelo
  const modelName = document.getElementById('modelName').value.trim();            // Nombre del modelo
  const margin = parseFloat(document.getElementById('margin').value);             // Margen de ganancia (%)

  // Validar entradas
  if (isNaN(price) || isNaN(exchangeRate) || isNaN(numPackages) || isNaN(dozensPerPackage) ||
      isNaN(pilotage) || isNaN(margin) || !modelCode || !modelName ||
      price <= 0 || exchangeRate <= 0 || numPackages <= 0 || dozensPerPackage <= 0 || pilotage < 0 || margin < 0) {
    alert("Por favor, ingresa valores válidos en todos los campos.");
    return;
  }

  // Cálculos:
  // 1. Precio de docena con pilotaje (sin margen):
  // Distribuir el pilotaje entre las docenas por bulto:
  const pilotagePerDocenaUSD = pilotage / dozensPerPackage;
  const docenaPriceWithPilotageUSD = price + pilotagePerDocenaUSD;
  const docenaPriceWithPilotageBOB = docenaPriceWithPilotageUSD * exchangeRate;
  
  // 2. Precio de docena con pilotaje + margen:
  const docenaPriceWithMarginBOB = docenaPriceWithPilotageBOB * (1 + margin / 100);
  
  // 3. Precio de bulto con pilotaje (sin margen):
  const packagePriceWithPilotageUSD = (price * dozensPerPackage) + pilotage;
  const packagePriceWithPilotageBOB = packagePriceWithPilotageUSD * exchangeRate;
  
  // 4. Precio de bulto con pilotaje + margen:
  const packagePriceWithMarginBOB = packagePriceWithPilotageBOB * (1 + margin / 100);
  
  // 5. Total revenue de todos los bultos (con margen):
  const totalRevenueWithMarginBOB = packagePriceWithMarginBOB * numPackages;
  
  // Mostrar resultados en la sección de cálculo
  const resultHTML = `
    <h3>Resultados para ${modelName} (Código: ${modelCode})</h3>
    <p><strong>Precio de docena con pilotaje (sin margen):</strong> ${docenaPriceWithPilotageBOB.toFixed(2)} BOB</p>
    <p><strong>Precio de docena con pilotaje + margen:</strong> ${docenaPriceWithMarginBOB.toFixed(2)} BOB</p>
    <p><strong>Precio de bulto con pilotaje (sin margen):</strong> ${packagePriceWithPilotageBOB.toFixed(2)} BOB</p>
    <p><strong>Precio de bulto con pilotaje + margen:</strong> ${packagePriceWithMarginBOB.toFixed(2)} BOB</p>
    <p><strong>Total revenue de todos los bultos (con margen):</strong> ${totalRevenueWithMarginBOB.toFixed(2)} BOB</p>
  `;
  calculationResult.innerHTML = resultHTML;
  
  // Crear objeto de nota para guardar en localStorage
  const note = {
    modelCode,
    modelName,
    docenaPriceWithMarginBOB: docenaPriceWithMarginBOB.toFixed(2),
    docenaPriceWithPilotageBOB: docenaPriceWithPilotageBOB.toFixed(2)
  };
  
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
  
  // Reiniciar formulario
  createNoteForm.reset();
});

// Función para mostrar notas guardadas
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
        <p><strong>Código:</strong> ${note.modelCode}</p>
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

// Función para eliminar una nota
function deleteNote(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes();
}

// Función para ver detalles completos de una nota (alerta)
function viewDetails(index) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let note = notes[index];
  alert(`Detalles de la Nota:
Código: ${note.modelCode}
Nombre: ${note.modelName}
Precio de docena con pilotaje (sin margen): ${note.docenaPriceWithPilotageBOB} BOB
Precio de docena con pilotaje + margen: ${note.docenaPriceWithMarginBOB} BOB`);
}

// Al cargar la página, mostrar por defecto la sección de crear nota
window.onload = function() {
  crearNotaSection.style.display = 'block';
  verNotasSection.style.display = 'none';
};
