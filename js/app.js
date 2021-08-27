const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector('#termino').value;

    if (terminoBusqueda === '') {
        mostrarAlerta('Add a search term');
        return;
    }

    buscarImagenes();
}

function mostrarAlerta(mensaje) {

    const existeAlerta = document.querySelector('.alert');

    if (!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('alert');

        alerta.innerHTML = `
            <strong>Error!</strong>
            <span>${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }


}




async function buscarImagenes() {

    const termino = document.querySelector('#termino').value;

    const key = '21351226-a5618a8faa6512f142721f4a9';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;


    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);
    } catch (error) {
        console.log(error);
    }
}





// Generador que va a registrar la cantidad de elementos de acuerdo a las paginas
function* crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}


function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes) {
    // console.log(imagenes);

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir el HTML
    imagenes.forEach(imagen => {
        const { previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `
            <div class="card">
                <div class="cardContainer">
                    <img class="w-full" src="${previewURL}" >

                    <div class="cardP">
                        <p> ${likes} <span> Likes </span> </p>
                        <p> ${views} <span> Views </span> </p>

                        <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            See Image
                        </a>
                    </div>
                </div>
            </div>
        `;

    });

    // Limpiar el paginador previo
    while (paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild)
    }

    // Generamos el nuevo HTML
    imprimirPaginador();

}


function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (true) {
        const { value, done } = iterador.next();
        if (done) return;

        // Caso contrario, genera un botón por cada elemento en el generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('next');

        boton.onclick = () => {
            paginaActual = value;

            buscarImagenes();
        }

        paginacionDiv.appendChild(boton);
    }
}