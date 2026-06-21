// array de perritos con la info
var listaPerritos = [
  { id: 1, nombre: "Max", cuota: 50, img: "img/max.jpg", cat: "pequeño", desc: "Enérgico y muy juguetón." },
  { id: 2, nombre: "Luna", cuota: 75, img: "img/luna.jpg", cat: "grande", desc: "Tranquila y protectora." },
  { id: 3, nombre: "Rocky", cuota: 60, img: "img/rocky.jpg", cat: "mediano", desc: "Le encanta correr en el parque." },
  { id: 4, nombre: "Bella", cuota: 45, img: "img/bella.jpg", cat: "pequeño", desc: "Ideal para departamentos." },
  { id: 5, nombre: "Thor", cuota: 80, img: "img/thor.jpg", cat: "grande", desc: "Un gigante muy dócil." },
  { id: 6, nombre: "Coco", cuota: 55, img: "img/coco.jpg", cat: "mediano", desc: "Muy inteligente y fácil de entrenar." },
  { id: 7, nombre: "Daisy", cuota: 40, img: "img/daisy.jpg", cat: "pequeño", desc: "Cariñosa y perfecta con niños." },
  { id: 8, nombre: "Bruno", cuota: 70, img: "img/bruno.jpg", cat: "grande", desc: "Fiel compañero de aventuras." }
];

// variables globales para el carrito
let carrito = [];
let guardado = localStorage.getItem("carritoGuardado");
if(guardado) {
    carrito = JSON.parse(guardado);
}

var miFormulario = document.getElementById("formulario-adopcion");

if(miFormulario != null){
    miFormulario.addEventListener("submit", function(event){
        // 1. Esto es CLAVE: Evita que la página se recargue sola
        event.preventDefault(); 
        
        // 2. Capturamos lo que el usuario escribió
        var nom = document.getElementById("input-nombre").value;
        var dni = document.getElementById("input-dni").value;
        var msj = document.getElementById("mensaje-error-form");
        
        // 3. Validación manual estilo estudiante
        if(nom == ""){
            msj.innerText = "Por favor, ingresa tu nombre completo.";
            msj.classList.remove("d-none"); // Mostramos la alerta roja
        } 
        else if(dni.length != 8){
            msj.innerText = "Error: El DNI debe tener exactamente 8 números.";
            msj.classList.remove("d-none");
        } 
        else {
            // 4. Si todo está correcto
            msj.classList.add("d-none"); // Ocultamos el error
            alert("¡Gracias por tu apoyo! Apadrinamiento confirmado.");
            
            // 5. Vaciamos el array del carrito dejándolo en 0
            carrito = []; 
            
            // 6. Actualizamos visualmente para que se guarde el carrito vacío
            actualizarCarrito(); 
            
            // 7. Limpiamos las cajas de texto del formulario
            miFormulario.reset();
        }
    });
}

// funcion para poner los perros en el html
function mostrarPerritos(filtro) {
    var contenedor = document.getElementById("contenedor-perritos");
    if(contenedor == null) return; // si no estamos en index, salir
    
    let html = "";
    
    // usamos un for normal para recorrer
    for(let i=0; i < listaPerritos.length; i++) {
        let p = listaPerritos[i]; 
        
        // logica de filtro un poco repetitiva
        if(filtro == "todos" || filtro == undefined) {
             html += "<div class='col-md-3 mb-4'><div class='card shadow-sm'><img src='" + p.img + "' class='card-img-top'><div class='card-body'><h5 class='card-title'>" + p.nombre + "</h5><p>" + p.desc + "</p><p>S/ " + p.cuota + "</p><button class='btn btn-primary' onclick='abrirModalDetalle(" + p.id + ")'>Detalles</button> <button class='btn btn-success mt-2' onclick='agregarAlCarrito(" + p.id + ")'>Apadrinar</button></div></div></div>";
        } else {
            if(p.cat == filtro) {
                 // pegamos el mismo html gigante otra vez
                 html += "<div class='col-md-3 mb-4'><div class='card shadow-sm'><img src='" + p.img + "' class='card-img-top'><div class='card-body'><h5 class='card-title'>" + p.nombre + "</h5><p>" + p.desc + "</p><p>S/ " + p.cuota + "</p><button class='btn btn-primary' onclick='abrirModalDetalle(" + p.id + ")'>Detalles</button> <button class='btn btn-success mt-2' onclick='agregarAlCarrito(" + p.id + ")'>Apadrinar</button></div></div></div>";
            }
        }
    }
    contenedor.innerHTML = html;
}

// capturar clicks en los botones de filtro
var botones = document.querySelectorAll(".btn-filtro");
for(var j=0; j < botones.length; j++){
    botones[j].addEventListener("click", function(e){
        var cat = e.target.getAttribute("data-categoria");
        mostrarPerritos(cat);
    });
}

function abrirModalDetalle(id) {
    let perroEncontrado = null;
    
    // buscar el perro a mano
    for(let i=0; i<listaPerritos.length; i++){
        if(listaPerritos[i].id == id){
            perroEncontrado = listaPerritos[i];
        }
    }
    
    if(perroEncontrado != null){
        document.getElementById("modal-titulo").innerText = perroEncontrado.nombre;
        document.getElementById("modal-img").src = perroEncontrado.img;
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
    // verificar si ya lo agregaron antes
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
function actualizarCarrito(){
    // 1. Guardar en localstorage para no perder datos
    localStorage.setItem("carritoGuardado", JSON.stringify(carrito));
    
    // 2. Actualizar el numero rojo de arriba (esto sí funcionaba)
    let spanContador = document.getElementById("contador-carrito");
    if(spanContador != null){
        let totalItems = 0;
        for(let c=0; c<carrito.length; c++){
            totalItems = totalItems + carrito[c].cantidad;
        }
        spanContador.innerText = totalItems;
    }

    // 3. (LO QUE FALTABA) Pintar los datos dentro del modal
    var contenedorItems = document.getElementById("items-carrito");
    var contenedorTotal = document.getElementById("total-carrito");
    
    // Verificamos que el modal exista en esta pagina
    if(contenedorItems != null){
        let htmlDelCarrito = "";
        let sumaTotal = 0;

        // Recorremos el carrito a la antigua para armar el texto
        for(let i = 0; i < carrito.length; i++){
            let item = carrito[i];
            let subtotal = item.cuota * item.cantidad; // calculamos el subtotal de este perrito
            sumaTotal = sumaTotal + subtotal;          // lo sumamos al total general

            // Armamos el HTML sumando textos (estilo estudiante)
            htmlDelCarrito += "<div class='d-flex justify-content-between mb-2 border-bottom pb-2'>";
            htmlDelCarrito += "<span>" + item.nombre + " (x" + item.cantidad + ")</span>";
            htmlDelCarrito += "<span>S/ " + subtotal + "</span>";
            htmlDelCarrito += "</div>";
        }

        // Si el carrito se quedó vacío, ponemos un mensaje
        if(carrito.length == 0){
            htmlDelCarrito = "<p>Tu carrito está vacío.</p>";
        }

        // Finalmente, metemos todo el texto armado al HTML
        contenedorItems.innerHTML = htmlDelCarrito;
        contenedorTotal.innerText = "S/ " + sumaTotal;
    }
}
// ejecutar al iniciar
mostrarPerritos("todos");
actualizarCarrito();