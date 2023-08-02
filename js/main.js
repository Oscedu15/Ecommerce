let  productos = []
 
fetch("./js/productos.json")
//Se tiene que buscar la ruta como si estuvieramos en la carpeta raiz del proyecto
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML ="";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="">
         <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
        </div> `

        contenedorProductos.appendChild(div);   
    })    

    actualizarBotonesAgregar();
};


//cargarProductos(productos);

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) =>{

        botonesCategorias.forEach(boton => boton.classList.remove("active"));

        e.currentTarget.classList.add("active");
        //con currentTarget tomamos todo el elemento incluidos los, no solamente al objeto q le damos click

        if(e.currentTarget.id != "todos"){
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            //El método find() devuelve el valor del primer elemento del array que cumple la función de prueba proporcionada.
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;

            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos"
            cargarProductos(productos);
        }       

    })
});

function actualizarBotonesAgregar () {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton =>{
        boton.addEventListener("click", agregarCarrito);
    });
}

let productosEnCarrito;

const productosEnCarritoLs = JSON.parse(localStorage.getItem("productos-en-carrito"));

    if(productosEnCarritoLs) {
        productosEnCarrito = productosEnCarritoLs;
        actualizarNumerito();
    } else {
         productosEnCarrito = [];
        //Aqui vamos a almecenar todos los productos agregados por nuestro cliente
    }

function agregarCarrito (e){
    //Para notificaciones emergentes, libreria
    Toastify({
        text: "Producto Agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          fontSize: ".75rem",
          textTransform: "uppercase",
        },
        offset: {
            x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1.5rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();


    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton );

   if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        //El método some() comprueba si al menos un elemento del array cumple con la condición implementada
        // por la función proporcionada. Nota: Este método devuelve false
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        //El método findIndex() devuelve el índice del primer elemento de un array que 
        //cumpla con la función de prueba proporcionada. En caso contrario devuelve -1.
        productosEnCarrito[index].cantidad++;
   } else{
        productoAgregado.cantidad = 1;
        //Aqui le agregamos una nueva propiedad a cada prodcuto en su array
        productosEnCarrito.push(productoAgregado);
    }   
    
    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito))
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
   // El método reduce() ejecuta una función reductora sobre cada elemento de un array, devolviendo como resultado un único valor.
    numerito.textContent = nuevoNumerito;
}
