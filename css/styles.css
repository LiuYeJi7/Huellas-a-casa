// array de perritos con la info (Cumple punto B: 8 ítems, 4+ propiedades)
var listaPerritos = [
  { id: 1, nombre: "Max", cuota: 50, img: "img/max.jpg", cat: "pequeño", desc: "Enérgico y muy juguetón." },
  { id: 2, nombre: "Luna", cuota: 75, img: "img/luna.jpg", cat: "grande", desc: "Tranquila y protectora." },
  { id: 3, nombre: "Rocky", cuota: 60, img: "img/rocky.jpg", cat: "mediano", desc: "Le encanta correr en el parque." },
  { id: 4, nombre: "Bella", cuota: 45, img: "img/bella.jpg", cat: "pequeño", desc: "Ideal para departamentos." },
  { id: 5, nombre: "Thor", cuota: 80, img: "img/thor.jpg", cat: "grande", desc: "Un gigante muy dócil." },
  { id: 6, nombre: "Coco", cuota: 55, img: "img/coco.jpg", cat: "mediano", desc: "Muy inteligente y fácil de entrenar." },
  { id: 7, nombre: "Daisy", cuota: 40, img: "img/daisy.jpg", cat: "pequeño", desc: "Cariñosa y perfecta con niños." },
  { id: 8, merge: true, nombre: "Bruno", cuota: 70, img: "img/bruno.jpg", cat: "grande", desc: "Fiel compañero de aventuras." }
];

// variables globales para el carrito (Cumple punto D: Persistencia localStorage)
let carrito = [];
let guardado = localStorage.getItem("carritoGuardado");
if(guardado) {
    carrito = JSON.parse(guardado);
}

var miFormulario = document.getElementById("formulario-adopcion");

if(miFormulario != null){
    miFormulario.addEventListener("submit", function(event){
        event.preventDefault(); // Evita que la página se recargue solo (Manejo de eventos)
        
        var nom = document.getElementById("input-nombre").value;
        var dni = document.getElementById("input-dni").value;
        var msj = document.getElementById("mensaje-error-form");
        
        // Validación manual requerida por rúbrica (Punto E)
        if(nom.trim() == ""){
            msj.innerText = "Por favor, ingresa tu nombre completo.";
            msj.classList.remove("d-none"); 
        } 
        else if(dni.length != 8 || isNaN(dni)){
            msj.innerText = "Error: El DNI debe tener exactamente 8 números.";
            msj.classList.remove("d-none");
        } 
        else {
            msj.classList.add("d-none"); 
            alert("¡Gracias por tu apoyo! Apadrinamiento confirmado.");
            carrito = []; 
            actualizarCarrito(); 
            miFormulario.reset();
        }
    });
}

// Función optimizada para mostrar perritos (Evita duplicar el código del HTML)
function mostrarPerritos(filtro) {
    var contenedor = document.getElementById("contenedor-perritos");
    if(contenedor == null) return; 
    
    let html = "";
    
    for(let i=0; i < listaPerritos.length; i++) {
        let p = listaPerritos[i]; 
        
        // Si el filtro es 'todos' o coincide con la categoría del perrito, lo dibujamos
        if(filtro == "todos" || filtro == undefined || p.cat == filtro) {
             // Agregamos alt='' para accesibilidad (Punto G)
             html += "<div class='col-md-3 mb-4'><div class='card shadow-sm'><img src='" + p.img + "' alt='Foto de " + p.nombre + "' class='card-img-top'><div class='card-body'><h5 class='card-title'>" + p.nombre + "</h5><p>" + p.desc + "</p><p class='fw-bold text-primary'>S/ " + p.cuota + "</p><button class='btn btn-primary btn-sm w-100' onclick='abrirModalDetalle(" + p.id + ")'>Detalles</button> <button class='btn btn-success btn-sm w-100 mt-2' onclick='agregarAlCarrito(" + p.id + ")'>Apadrinar</button></div></div></div>";
        }
    }
    contenedor.innerHTML = html;
}

// Capturar clicks en los botones de filtro (Eventos tipo Click)
var botones = document.querySelectorAll(".btn-filtro");
for(var j=0; j < botones.length; j++){
    botones[j].addEventListener("click", function(e){
        var cat = e.target.getAttribute("data-categoria");
        mostrarPerritos(cat);
    });
}

function abrirModalDetalle(id) {
    let perroEncontrado = null;
    for(let i=0; i<listaPerritos.length; i++){
        if(listaPerritos[i].id == id){
            perroEncontrado = listaPerritos[i];
        }
    }
    
    if(perroEncontrado != null){
        document.getElementById("modal-titulo").innerText = perroEncontrado.nombre;
        document.getElementById("modal-img").src = perroEncontrado.img;
        document.getElementById("modal-img").alt = "Foto de " + perroEncontrado.nombre; // Accesibilidad
        document.getElementById("modal-desc").innerText = perroEncontrado.desc;
        document.getElementById("modal-precio").innerText = "S/ " + perroEncontrado.cuota;
        
        document.getElementById("modal-btn-agregar").setAttribute("onclick", "agregarAlCarrito(" + perroEncontrado.id + ")");
        
        var modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
        modal.show();
    }
}

function agregarAlCarrito(id) {
    let perroEncontrado = null;
    for(let i=0; i<listaPerritos.length; i++){
         if(listaPerritos[i].id == id){
            perroEncontrado = listaPerritos[i];
         }
    }

    let yaExiste = false;
    for(let x=0; x<carrito.length; x++){
        if(carrito[x].id == id){
            carrito[x].cantidad = carrito[x].cantidad + 1;
            yaExiste = true;
        }
    }

    if(yaExiste == false){
        carrito.push({
            id: perroEncontrado.id,
            nombre: perroEncontrado.nombre,
            cuota: perroEncontrado.cuota,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

// ¡NUEVA FUNCIÓN REQUERIDA POR LA RÚBRICA!: Eliminar del carrito
function eliminarDelCarrito(id) {
    for(let i=0; i<carrito.length; i++){
        if(carrito[i].id == id){
            if(carrito[i].cantidad > 1){
                carrito[i].cantidad = carrito[i].cantidad - 1; // Resta uno si hay varios
            } else {
                carrito.splice(i, 1); // Lo borra por completo de la lista si solo queda 1
            }
            break;
        }
    }
    actualizarCarrito();
}

function actualizarCarrito(){
    localStorage.setItem("carritoGuardado", JSON.stringify(carrito));
    
    let spanContador = document.getElementById("contador-carrito");
    if(spanContador != null){
        let totalItems = 0;
        for(let c=0; c<carrito.length; c++){
            totalItems = totalItems + carrito[c].cantidad;
        }
        spanContador.innerText = totalItems;
    }

    var contenedorItems = document.getElementById("items-carrito");
    var contenedorTotal = document.getElementById("total-carrito");
    
    if(contenedorItems != null){
        let htmlDelCarrito = "";
        let sumaTotal = 0;

        for(let i = 0; i < carrito.length; i++){
            let item = carrito[i];
            let subtotal = item.cuota * item.cantidad; 
            sumaTotal = sumaTotal + subtotal;          

            htmlDelCarrito += "<div class='d-flex justify-content-between align-items-center mb-2 border-bottom pb-2'>";
            htmlDelCarrito += "<span>" + item.nombre + " (x" + item.cantidad + ")</span>";
            htmlDelCarrito += "<div><span class='me-2'>S/ " + subtotal + "</span>";
            // Añadimos el botón de eliminar físicamente aquí
            htmlDelCarrito += "<button class='btn btn-danger btn-sm py-0px px-2' onclick='eliminarDelCarrito(" + item.id + ")'>&times;</button></div>";
            htmlDelCarrito += "</div>";
        }

        if(carrito.length == 0){
            htmlDelCarrito = "<p class='text-muted text-center'>Tu lista está vacía.</p>";
        }

        contenedorItems.innerHTML = htmlDelCarrito;
        contenedorTotal.innerText = "S/ " + sumaTotal;
    }
}

// Ejecución inicial obligatoria al abrir la página
mostrarPerritos("todos");
actualizarCarrito();