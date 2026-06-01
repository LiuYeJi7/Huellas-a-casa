// ====================================================================
// 1. BASE DE DATOS LOCAL (Requisito: Array de objetos JavaScript)
// ====================================================================
// Definimos nuestro catálogo aquí en lugar de hacerlo en el HTML.
// Esto permite que el sitio sea escalable y fácil de mantener.
const catalogoPerritos = [
    { id: 1, nombre: "Paco", tipo: "mestizo", cuota: 50.00, imagen: "../img/paco.jpg", descripcion: "Juguetón y lleno de energía." },
    { id: 2, nombre: "Luna", tipo: "raza", cuota: 120.00, imagen: "../img/luna.jpg", descripcion: "Labrador cariñosa y protectora." },
    { id: 3, nombre: "Rocky", tipo: "raza", cuota: 150.00, imagen: "../img/rocky.jpg", descripcion: "Bulldog Francés ideal para departamentos." },
    { id: 4, nombre: "Bella", tipo: "mestizo", cuota: 40.00, imagen: "../img/bella.jpg", descripcion: "Rescatada, muy dócil y obediente." },
    { id: 5, nombre: "Max", tipo: "raza", cuota: 140.00, imagen: "../img/max.jpg", descripcion: "Pastor Alemán leal y guardián." },
    { id: 6, nombre: "Kira", tipo: "mestizo", cuota: 60.00, imagen: "../img/kira.jpg", descripcion: "Cachorrita rescatada con mucha energía." }
];

// ====================================================================
// 2. PERSISTENCIA DE DATOS (Requisito: Uso de localStorage)
// ====================================================================
// Intentamos recuperar la cesta guardada en el navegador usando getItem.
// Usamos JSON.parse para convertir el texto plano de vuelta a un Array.
// Si no hay nada guardado (null), inicializamos la cesta como un array vacío [].
let cesta = JSON.parse(localStorage.getItem('cestaPerritos')) || [];

// ====================================================================
// 3. LÓGICA DE LA CESTA (Agregar, Eliminar, Actualizar y Totales)
// ====================================================================

// Actualiza el pequeño globo rojo con el número de ítems en el menú
function actualizarContadorCesta() {
    const contador = document.getElementById('contador-cesta');
    if (contador) {
        // El método reduce() suma las cantidades de todos los objetos en la cesta
        const totalItems = cesta.reduce((acumulador, item) => acumulador + item.cantidad, 0);
        contador.textContent = totalItems;
    }
}

// Función que se ejecuta al darle clic a "Apadrinar" en la tarjeta
function agregarALaCesta(id) {
    // Buscamos el perrito en el catálogo original
    const perritoSeleccionado = catalogoPerritos.find(p => p.id === id);
    // Verificamos si ya existe en la cesta
    const existe = cesta.find(item => item.id === id);
    
    if (existe) {
        existe.cantidad++; // Si ya está, solo sumamos 1 mes más
    } else {
        // Si no está, lo agregamos clonando el objeto (...perritoSeleccionado) y asignando cantidad 1
        cesta.push({ ...perritoSeleccionado, cantidad: 1 });
    }
    guardarYActualizar(); // Guardamos el cambio en la memoria del navegador
}

// Filtra la cesta para quedarse con todos los perritos EXCEPTO el que queremos eliminar
function eliminarDeLaCesta(id) {
    cesta = cesta.filter(item => item.id !== id);
    guardarYActualizar();
    renderizarCesta(); // Redibujamos la vista de la cesta para que desaparezca visualmente
}

// Actualiza los meses (cantidad) desde el input numérico de la ventana modal
function cambiarCantidad(id, nuevaCantidad) {
    const cantidadNumerica = parseInt(nuevaCantidad);
    if (cantidadNumerica < 1 || isNaN(cantidadNumerica)) return; // Evitamos números negativos o textos
    
    const item = cesta.find(item => item.id === id);
    if (item) {
        item.cantidad = cantidadNumerica;
    }
    guardarYActualizar();
    renderizarCesta(); // Redibujamos para que el total (S/) se actualice al instante
}

// Función auxiliar para no repetir código: Guarda en memoria y actualiza el contador
function guardarYActualizar() {
    // JSON.stringify convierte el array a texto para que localStorage lo acepte
    localStorage.setItem('cestaPerritos', JSON.stringify(cesta));
    actualizarContadorCesta();
}

// ====================================================================
// 4. MANIPULACIÓN DEL DOM (Generación dinámica de HTML con JS)
// ====================================================================

// Construye el HTML de lo que está dentro de la ventana modal
function renderizarCesta() {
    const contenedorItems = document.getElementById('items-cesta');
    const contenedorTotal = document.getElementById('precio-total');
    
    if (!contenedorItems) return;
    
    // Si la cesta está vacía, mostramos un mensaje amigable
    if (cesta.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; padding:1rem; color:#888;">Tu cesta está vacía. ¡Adopta o apadrina un amigo!</p>';
        if (contenedorTotal) contenedorTotal.textContent = "0.00";
        return;
    }

    contenedorItems.innerHTML = ''; // Limpiamos el contenedor
    let acumuladorTotal = 0; // Variable para calcular el costo total matemático

    // Iteramos la cesta para construir cada fila
    cesta.forEach(item => {
        const subtotal = item.cuota * item.cantidad; // Multiplicamos cuota por meses
        acumuladorTotal += subtotal; // Lo sumamos al total general

        // Corrección de rutas para las imágenes según la página en la que estemos
        let rutaImg = item.imagen;
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            rutaImg = item.imagen.replace('../', '');
        }

        // Creamos un nuevo elemento <div> usando createElement
        const fila = document.createElement('div');
        fila.classList.add('item-cesta-row'); // Le damos su clase CSS
        // Usamos backticks (`) para inyectar variables JS dentro de HTML puro
        fila.innerHTML = `
            <img src="${rutaImg}" alt="${item.nombre}">
            <div class="item-cesta-info">
                <h4>${item.nombre}</h4>
                <p>Cuota: S/ ${item.cuota.toFixed(2)}</p>
            </div>
            <div class="item-cesta-controles">
                <label style="font-size:0.8rem; color:#666;">Meses:</label>
                <input type="number" value="${item.cantidad}" min="1" onchange="cambiarCantidad(${item.id}, this.value)">
                <button class="btn-eliminar" onclick="eliminarDeLaCesta(${item.id})">Quitar</button>
            </div>
        `;
        contenedorItems.appendChild(fila); // Inyectamos la fila en la pantalla
    });

    if (contenedorTotal) {
        contenedorTotal.textContent = acumuladorTotal.toFixed(2); // Mostramos total con 2 decimales
    }
}

// Construye las tarjetas (cards) del catálogo en la página principal o de categorías
function renderizarTarjetas(listaPerritos, contenedor) {
    contenedor.innerHTML = '';
    listaPerritos.forEach(perrito => {
        let rutaImg = perrito.imagen;
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            rutaImg = perrito.imagen.replace('../', '');
        }

        const tarjeta = document.createElement('article');
        tarjeta.classList.add('tarjeta-perrito');
        tarjeta.innerHTML = `
            <img src="${rutaImg}" alt="Foto de ${perrito.nombre}">
            <div class="info-perrito">
                <h3>${perrito.nombre}</h3>
                <p>${perrito.descripcion}</p>
                <p class="precio">Cuota: S/ ${perrito.cuota.toFixed(2)}</p>
                <button class="btn-agregar" onclick="agregarALaCesta(${perrito.id})">Apadrinar</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// ====================================================================
// 5. CONTROLADORES Y EVENTOS INICIALES (Event Listeners)
// ====================================================================

// Esta función es el "motor de arranque". Se ejecuta cuando la página termina de cargar.
function inicializarPaginas() {
    // Detectamos en qué página estamos buscando los IDs de los contenedores
    const contenedorMestizos = document.getElementById('catalogo-mestizos');
    const contenedorRaza = document.getElementById('catalogo-raza');
    
    // Capturamos los elementos de la ventana modal
    const botonIconoCesta = document.querySelector('.cesta-icono');
    const modal = document.getElementById('modal-cesta');
    const botonCerrarModal = document.getElementById('btn-cerrar-modal');

    actualizarContadorCesta();

    // Filtramos el catálogo global usando el método filter() para mostrar solo los de la categoría actual
    if (contenedorMestizos) {
        const mestizos = catalogoPerritos.filter(p => p.tipo === "mestizo");
        renderizarTarjetas(mestizos, contenedorMestizos);
    }
    if (contenedorRaza) {
        const razas = catalogoPerritos.filter(p => p.tipo === "raza");
        renderizarTarjetas(razas, contenedorRaza);
    }

    // Eventos 'click' para controlar la apertura y cierre de la ventana modal
    if (botonIconoCesta && modal && botonCerrarModal) {
        botonIconoCesta.addEventListener('click', () => {
            renderizarCesta(); // Renderizamos la lista actualizada antes de mostrarla
            modal.classList.add('mostrar');
        });

        botonCerrarModal.addEventListener('click', () => {
            modal.classList.remove('mostrar');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('mostrar');
            }
        });

        // Evento 'click' para redireccionar a la página de pago / contacto de forma inteligente
        const botonConfirmar = document.getElementById('btn-confirmar-cesta');
        if (botonConfirmar) {
            botonConfirmar.addEventListener('click', () => {
                if (window.location.pathname.includes('contacto.html')) {
                    modal.classList.remove('mostrar');
                    document.querySelector('.caja-formulario').scrollIntoView({ behavior: 'smooth' });
                } else {
                    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
                        window.location.href = 'pages/contacto.html';
                    } else {
                        window.location.href = 'contacto.html';
                    }
                }
            });
        }
    }
}

// EVENTO TIPO 1: DOMContentLoaded -> Espera a que el HTML exista antes de ejecutar JS
document.addEventListener('DOMContentLoaded', inicializarPaginas);

// ====================================================================
// 6. VALIDACIÓN DE FORMULARIO (Indicador 8: Validación JS y Regex)
// ====================================================================

const formularioAdopcion = document.getElementById('formulario-adopcion');

if (formularioAdopcion) {
    // EVENTO TIPO 2: 'submit' -> Ocurre cuando el usuario presiona "Enviar"
    formularioAdopcion.addEventListener('submit', function(evento) {
        // preventDefault() es VITAL: Evita que la página se recargue y HTML5 intente validar
        evento.preventDefault();

        let formularioValido = true;

        const inputNombre = document.getElementById('nombre');
        const inputCorreo = document.getElementById('correo');
        const inputTelefono = document.getElementById('telefono');

        // Función reutilizable para pintar el input de rojo (clase 'input-error')
        const mostrarError = (input, mensajeID, mensaje) => {
            input.classList.remove('input-exito');
            input.classList.add('input-error');
            document.getElementById(mensajeID).textContent = mensaje;
            formularioValido = false;
        };

        // Función reutilizable para pintar el input de verde (clase 'input-exito')
        const mostrarExito = (input, mensajeID) => {
            input.classList.remove('input-error');
            input.classList.add('input-exito');
            document.getElementById(mensajeID).textContent = '';
        };

        // Validación Básica: Mayor a 3 caracteres
        if (inputNombre.value.trim().length < 3) {
            mostrarError(inputNombre, 'error-nombre', 'El nombre debe tener al menos 3 letras.');
        } else {
            mostrarExito(inputNombre, 'error-nombre');
        }

        // Validación Regex: Expresión regular para estructura de correo "texto@texto.dominio"
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(inputCorreo.value.trim())) {
            mostrarError(inputCorreo, 'error-correo', 'Ingresa un correo electrónico válido.');
        } else {
            mostrarExito(inputCorreo, 'error-correo');
        }

        // Validación Regex: Exactamente 9 dígitos numéricos (Para teléfonos en Perú)
        const regexTelefono = /^[0-9]{9}$/;
        if (!regexTelefono.test(inputTelefono.value.trim())) {
            mostrarError(inputTelefono, 'error-telefono', 'El teléfono debe tener 9 dígitos numéricos.');
        } else {
            mostrarExito(inputTelefono, 'error-telefono');
        }

        // Si todas las validaciones pasaron (formularioValido sigue siendo true)
        if (formularioValido) {
            alert(`¡Gracias ${inputNombre.value}! Hemos recibido tu solicitud. Nos pondremos en contacto pronto.`);
            
            // Limpiamos los datos del sistema tras el éxito
            cesta = []; 
            guardarYActualizar();
            renderizarCesta();
            formularioAdopcion.reset(); // Vacía los inputs
            
            inputNombre.classList.remove('input-exito');
            inputCorreo.classList.remove('input-exito');
            inputTelefono.classList.remove('input-exito');
        }
    });

    // EVENTO TIPO 3: 'input' -> Se ejecuta en tiempo real mientras el usuario escribe
    const inputs = formularioAdopcion.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Borramos el borde rojo apenas el usuario empieza a corregir su error
            input.classList.remove('input-error');
            const mensajeId = 'error-' + input.id;
            document.getElementById(mensajeId).textContent = '';
        });
    });
}