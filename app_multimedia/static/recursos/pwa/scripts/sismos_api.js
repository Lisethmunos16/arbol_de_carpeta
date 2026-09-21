document.addEventListener('DOMContentLoaded', () => {
    const mapaElement = document.getElementById('mapa');
    if (!mapaElement) return;

    // 1. Inicializar mapa centrado en Colombia
    const map = L.map('mapa').setView([4.5709, -74.2973], 6);

    // Capa de mapa base gratuita sin API KEY
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    let usuarioUbicacion = null;
    let lineaRuta = null;

    // 2. Obtener geolocalización actual
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
                usuarioUbicacion = [pos.coords.latitude, pos.coords.longitude];
                L.marker(usuarioUbicacion)
                    .addTo(map)
                    .bindPopup("<b>📍 Tu ubicación actual</b>")
                    .openPopup();
            },
            err => console.warn("No se pudo obtener la geolocalización:", err.message)
        );
    }

    // 3. Consumir la API de sismos
    const contenedorLista = document.getElementById('lista-sismos');

    fetch(URL_API_SISMOS)
        .then(response => response.json())
        .then(data => {
            if (contenedorLista) contenedorLista.innerHTML = '';

            data.features.forEach(sismo => {
                const [lng, lat, prof] = sismo.geometry.coordinates;
                const mag = sismo.properties.mag;
                const lugar = sismo.properties.place;

                // Color dinámico según la magnitud
                const colorMarker = mag >= 5 ? '#e74c3c' : mag >= 4 ? '#e67e22' : '#f1c40f';

                // Agregar círculo al mapa
                const marker = L.circleMarker([lat, lng], {
                    radius: mag * 2.5,
                    fillColor: colorMarker,
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(map);

                const popupHtml = `
                    <div style="font-size: 12px;">
                        <b>📍 Lugar:</b> ${lugar}<br>
                        <b>Magnitud:</b> M ${mag}<br>
                        <b>Profundidad:</b> ${prof} km<br><br>
                        <button onclick="trazarRuta(${lat}, ${lng})" style="background:#27ae60; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">
                            🗺️ Trazar Ruta
                        </button>
                    </div>
                `;
                marker.bindPopup(popupHtml);

                // Agregar elemento a la lista debajo del mapa
                if (contenedorLista) {
                    const item = document.createElement('div');
                    item.className = 'sismo-item';
                    item.innerHTML = `<strong>M ${mag}</strong> - ${lugar} (${prof} km profundidad)`;
                    item.onclick = () => {
                        map.setView([lat, lng], 8);
                        marker.openPopup();
                    };
                    contenedorLista.appendChild(item);
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar datos de la API de sismos:", error);
            if (contenedorLista) {
                contenedorLista.innerHTML = '<p>Error al cargar los datos de sismos.</p>';
            }
        });

    // 4. Función global para trazar ruta de evacuación
    window.trazarRuta = function(destLat, destLng) {
        if (!usuarioUbicacion) {
            alert("Activa la ubicación en tu navegador para trazar la ruta desde tu posición.");
            return;
        }

        if (lineaRuta) map.removeLayer(lineaRuta);

        lineaRuta = L.polyline([usuarioUbicacion, [destLat, destLng]], {
            color: '#2980b9',
            weight: 4,
            dashArray: '6, 6'
        }).addTo(map);

        map.fitBounds(lineaRuta.getBounds(), { padding: [40, 40] });
    };
});