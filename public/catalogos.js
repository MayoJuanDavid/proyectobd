document.addEventListener("DOMContentLoaded", function() {
    // Obtener el id_productor de la URL
    const params = new URLSearchParams(window.location.search);
    const id_productor = params.get('id_productor');

    if (!id_productor) {
        console.error('id_productor no está presente en la URL');
        return;
    }

    //actualizar url
    const formCatalogoLink = document.querySelector('.formCatalogo');
    formCatalogoLink.href = `FormCatalogoProductor.html?id_productor=${id_productor}`;

    
// Obtener los detalles del productor
    fetch(`/Productores/${id_productor}`) 
    .then(response => { 
        if (!response.ok) { 
            throw new Error('Error en la respuesta del servidor'); 
        } 
        return response.json(); 
    }) 
    .then(data => { 
        console.log(data);
        if (data && data.nombre) { 
            const NombreProductor = document.querySelector('.NombreProductor'); 
            NombreProductor.innerText = data.nombre; 
        } else { 
            console.error('El nombre del productor no está disponible'); 
        } 
    }) 
    .catch(error => { 
        console.error('Error al obtener los detalles del productor:', error); 
    });


    // Cargar y mostrar los catálogos del productor
    fetch(`/Catalogos?id_productor=${id_productor}`)
    .then(response => response.json())
    .then(data => {
        displayCatalogs(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    function displayCatalogs(catalogos) {
        const rectangles = [
            document.querySelector('.Cuadrocatalogo1'),
            document.querySelector('.Cuadrocatalogo2'),
            document.querySelector('.Cuadrocatalogo3'),
            document.querySelector('.Cuadrocatalogo4')
        ];
        const flechaDer = document.querySelector('.FlechaDer');
        const flechaIzq = document.querySelector('.FlechaIzq');

        let currentIndex = 0;

        // Inicialmente oculta todos los cuadros y flechas
        rectangles.forEach(rect => rect.style.display = 'none');
        flechaDer.style.display = 'none';
        flechaIzq.style.display = 'none';

        // Mostrar los cuadros con datos
        updateRectangles(catalogos, rectangles, currentIndex);

        // Mostrar flechas si hay más de 4 catálogos
        if (catalogos.length > 4) {
            flechaDer.style.display = 'block';

            flechaDer.addEventListener('click', () => {
                currentIndex += 4;
                if (currentIndex >= catalogos.length) {
                    currentIndex = catalogos.length - 4;
                }
                updateRectangles(catalogos, rectangles, currentIndex);

                // Mostrar u ocultar flechas según el índice actual
                if (currentIndex + 4 >= catalogos.length) {
                    flechaDer.style.display = 'none';
                } else {
                    flechaDer.style.display = 'block';
                }

                if (currentIndex > 0) {
                    flechaIzq.style.display = 'block';
                } else {
                    flechaIzq.style.display = 'none';
                }
            });

            flechaIzq.addEventListener('click', () => {
                currentIndex -= 4;
                if (currentIndex < 0) {
                    currentIndex = 0;
                }
                updateRectangles(catalogos, rectangles, currentIndex);

                // Mostrar u ocultar flechas según el índice actual
                if (currentIndex + 4 >= catalogos.length) {
                    flechaDer.style.display = 'none';
                } else {
                    flechaDer.style.display = 'block';
                }

                if (currentIndex > 0) {
                    flechaIzq.style.display = 'block';
                } else {
                    flechaIzq.style.display = 'none';
                }
            });
        }
    }

    // Función para actualizar la información de un cuadro
    function updateCuadroCatalogo(cuadro, catalogo, index) {
        switch(index) {
            case 0:
                cuadro.querySelector('.Catalogo1').innerText = catalogo.nombre_catalogo;
                cuadro.querySelector('.Vbn1').innerText = `VBN no. ${catalogo.cod_vbn}`;
                cuadro.querySelector('.Descripcion1').innerText = catalogo.descripcion;
                break;
            case 1:
                cuadro.querySelector('.Catalogo2').innerText = catalogo.nombre_catalogo;
                cuadro.querySelector('.Vbn2').innerText = `VBN no. ${catalogo.cod_vbn}`;
                cuadro.querySelector('.Descripcion2').innerText = catalogo.descripcion;
                break;
            case 2:
                cuadro.querySelector('.Catalogo3').innerText = catalogo.nombre_catalogo;
                cuadro.querySelector('.Vbn3').innerText = `VBN no. ${catalogo.cod_vbn}`;
                cuadro.querySelector('.Descripcion3').innerText = catalogo.descripcion;
                break;
            case 3:
                cuadro.querySelector('.Catalogo4').innerText = catalogo.nombre_catalogo;
                cuadro.querySelector('.Vbn4').innerText = `VBN no. ${catalogo.cod_vbn}`;
                cuadro.querySelector('.Descripcion4').innerText = catalogo.descripcion;
                break;
        }
    }

    // Función para actualizar la visualización de los cuadros
    function updateRectangles(catalogos, rectangles, startIndex) {
        rectangles.forEach(rect => rect.style.display = 'none');
        catalogos.slice(startIndex, startIndex + 4).forEach((catalogo, index) => {
            const rect = rectangles[index];
            if (rect) {
                rect.style.display = 'block';
                updateCuadroCatalogo(rect, catalogo, index);
            }
        });
    }
});
