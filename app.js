document.getElementById('crearNotas').addEventListener('click', function() {
    document.getElementById('crearNotasForm').style.display = 'block';
    document.getElementById('verNotasList').style.display = 'none';
});

document.getElementById('verNotas').addEventListener('click', function() {
    document.getElementById('crearNotasForm').style.display = 'none';
    document.getElementById('verNotasList').style.display = 'block';
    mostrarNotas();
});

document.getElementById('guardarNota').addEventListener('click', function() {
    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const tasa = parseFloat(document.getElementById('tasa').value);
    const margen = parseFloat(document.getElementById('margen').value);

    if (!codigo || !nombre || isNaN(precio) || isNaN(tasa) || isNaN(margen)) {
        alert("Por favor, ingresa todos los datos correctamente.");
        return;
    }

    // Cálculo de la docena con y sin margen
    const precioConMargen = precio * tasa * (1 + margen / 100);
    const precioSinMargen = precio * tasa;

    // Crear el objeto de la nota
    const nota = {
        codigo,
        nombre,
        precio,
        tasa,
        margen,
        precioConMargen,
        precioSinMargen
    };

    // Guardar la nota en el localStorage
    let notasGuardadas = JSON.parse(localStorage.getItem('notas')) || [];
    notasGuardadas.push(nota);
    localStorage.setItem('notas', JSON.stringify(notasGuardadas));

    // Limpiar los campos
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('tasa').value = '';
    document.getElementById('margen').value = '';

    alert('Nota guardada exitosamente.');
});

function mostrarNotas() {
    const notas = JSON.parse(localStorage.getItem('notas')) || [];
    const notasListaDiv = document.getElementById('notasLista');

    if (notas.length === 0) {
        notasListaDiv.innerHTML = '<p>No hay notas guardadas.</p>';
        return;
    }

    let notasHTML = '';
    notas.forEach((nota, index) => {
        notasHTML += `
            <div>
                <p><strong>Código:</strong> ${nota.codigo}</p>
                <p><strong>Nombre:</strong> ${nota.nombre}</p>
                <p><strong>Precio por docena con margen:</strong> ${nota.precioConMargen} BOB</p>
                <p><strong>Precio por docena sin margen:</strong> ${nota.precioSinMargen} BOB</p>
                <button onclick="eliminarNota(${index})">Eliminar</button>
                <button onclick="verDetalles(${index})">Ver Detalles</button>
            </div>
            <hr>
        `;
    });

    notasListaDiv.innerHTML = notasHTML;
}

function eliminarNota(index) {
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    notas.splice(index, 1); // Eliminar la nota
    localStorage.setItem('notas', JSON.stringify(notas)); // Guardar el nuevo array en localStorage
    mostrarNotas(); // Volver a mostrar las notas
}

function verDetalles(index) {
    const notas = JSON.parse(localStorage.getItem('notas')) || [];
    const nota = notas[index];

    alert(`Detalles de la Nota:
    Código: ${nota.codigo}
    Nombre: ${nota.nombre}
    Precio por docena con margen: ${nota.precioConMargen} BOB
    Precio por docena sin margen: ${nota.precioSinMargen} BOB`);
}
