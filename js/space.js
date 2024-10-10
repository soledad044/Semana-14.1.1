document.getElementById('btnBuscar').addEventListener('click', () => {
    const terminoBusqueda = document.getElementById('inputBuscar').value;

    if (!terminoBusqueda.trim()) {
        document.getElementById('resultados').innerHTML = '<p>Por favor, ingrese un término de búsqueda.</p>';
        return;
    }

    const apiUrl = `https://images-api.nasa.gov/search?q=${encodeURIComponent(terminoBusqueda)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();  // Convertir la respuesta a JSON
        })
        .then(data => {
            const resultados = data.collection.items;  // Obtener los resultados de la respuesta
            mostrarResultados(resultados);  // Mostrar los resultados en la página
        })
        .catch(error => console.error('Error al obtener los datos de la NASA:', error));
});

// Función para mostrar los resultados en formato de tarjeta
const mostrarResultados = (resultados) => {
    const contenedorResultados = document.getElementById('resultados');
    contenedorResultados.innerHTML = '';

    if (resultados.length === 0) {
        contenedorResultados.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    resultados.forEach(item => {
        const titulo = item.data[0].title;
        const descripcion = item.data[0].description || 'Sin descripción';
        const fechaISO = item.data[0].date_created;

        // Convertir la fecha ISO a un objeto Date, porque como está por defecto, no me gusta.
        const fecha = new Date(fechaISO);

        // Formatear la fecha a un formato más legible
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

        const imagenUrl = item.links && item.links[0].href ? item.links[0].href : 'default-image.jpg';

        const tarjeta = `
            <div class="col-12 col-sm-6 col-md-4 my-3">
                <div class="card">
                    <img src="${imagenUrl}" class="card-img-top" alt="${titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${titulo}</h5>
                        <p class="card-text">${descripcion}</p>
                        <p class="card-text"><small class="text-muted">${fechaFormateada}</small></p>
                    </div>
                </div>
            </div>
        `;
        contenedorResultados.innerHTML += tarjeta;  // Añadir la tarjeta al contenedor
    });
};
