function mostrarSeccion(seccion) {
    document.getElementById("calculadora").style.display = seccion === "calculadora" ? "block" : "none";
    document.getElementById("verNotas").style.display = seccion === "verNotas" ? "block" : "none";
    if (seccion === "verNotas") mostrarNotas();
}

function calcular() {
    let codigo = document.getElementById('codigo').value.trim();
    let nombre = document.getElementById('nombre').value.trim();
    let precioPorDocenaUSD = parseFloat(document.getElementById('precioDocena').value);
    let tasaCambio = parseFloat(document.getElementById('tasaCambio').value);
    let docenasPorBulto = parseInt(document.getElementById('docenasPorBulto').value);
    let pilotajeUSD = parseFloat(document.getElementById('pilotaje').value);
    let cantidadBultos = parseInt(document.getElementById('cantidadBultos').value);
    let margen = parseFloat(document.getElementById('margen').value);

    if (!codigo || !nombre || isNaN(precioPorDocenaUSD) || isNaN(tasaCambio) || isNaN(docenasPorBulto) || isNaN(pilotajeUSD) || isNaN(cantidadBultos) || isNaN(margen)) {
        alert("Por favor, llena todos los campos correctamente.");
        return;
    }

    let precioBultoUSD = (precioPorDocenaUSD * docenasPorBulto) + pilotajeUSD;
    let precioBultoBOB = precioBultoUSD * tasaCambio;
    let precioDocenaBOB = precioBultoBOB / docenasPorBulto;
    let precioDocenaConMargenBOB = precioDocenaBOB * (1 + margen / 100);
    let precioBultoConMargenBOB = precioBultoBOB * (1 + margen / 100);
    let totalBultosBOB = precioBultoConMargenBOB * cantidadBultos;

    let resultado = `
        <h3>Resultado para ${nombre} (${codigo})</h3>
        <p><strong>Precio por docena (BOB):</strong> ${precioDocenaBOB.toFixed(2)}</p>
        <p><strong>Precio por docena con margen (BOB):</strong> ${precioDocenaConMargenBOB.toFixed(2)}</p>
        <p><strong>Precio por bulto (BOB):</strong> ${precioBultoBOB.toFixed(2)}</p>
        <p><strong>Precio por bulto con margen (BOB):</strong> ${precioBultoConMargenBOB.toFixed(2)}</p>
        <p><strong>Total por ${cantidadBultos} bultos (BOB):</strong> ${totalBultosBOB.toFixed(2)}</p>
    `;

    document.getElementById('resultado').innerHTML = resultado;

    let nota = {
        codigo,
        nombre,
        precioBultoConMargenBOB
    };

    guardarNota(nota);
}

function guardarNota(nota) {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.push(nota);
    localStorage.setItem('notas', JSON.stringify(notas));
}

function mostrarNotas() {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    let listaNotas = document.getElementById('listaNotas');
    listaNotas.innerHTML = "";

    notas.forEach((nota, index) => {
        let div = document.createElement('div');
        div.classList.add('nota');
        div.innerHTML = `<strong>${nota.codigo} - ${nota.nombre}:</strong> ${nota.precioBultoConMargenBOB.toFixed(2)} BOB
        <button onclick="eliminarNota(${index})">🗑️</button>`;
        listaNotas.appendChild(div);
    });
}

function eliminarNota(index) {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.splice(index, 1);
    localStorage.setItem('notas', JSON.stringify(notas));
    mostrarNotas();
}
