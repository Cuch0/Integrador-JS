// Cada producto que vende el super es creado con esta clase
class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}

// Creo todos los productos que vende mi super
const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [
    queso, 
    gaseosa, 
    cerveza, 
    arroz, 
    fideos, 
    lavandina, 
    shampoo, 
    jabon
];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

       /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);

        try {
            
            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);
            
            console.log("Producto encontrado", producto);

            // Creo un producto nuevo
            const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);

            for (let i = 0 ; i < this.productos.length ; i++) {
                if ( this.productos[i].sku == sku ) {
                    this.precioTotal = this.precioTotal + (producto.precio * cantidad);
                    this.productos[i].cantidad += cantidad;
                    return
                }
            }

            this.productos.push(nuevoProducto);
            this.precioTotal = this.precioTotal + (producto.precio * cantidad);
            if (this.categorias.includes(producto.categoria) == false) {
                this.categorias.push(producto.categoria);
            }
        } catch (error) {
            console.log(error);
        }
    
    }
    
    eliminarProducto (sku, cantidad)  {
        return new Promise((resolve, reject) => {
        setTimeout( async () => {

            let flag = false;
            
            const producto = await findProductBySku(sku)
            .catch((error) => {
                console.log(error);
            })

            for (let i = 0; i < this.productos.length; i++) {
                if (this.productos[i].sku == sku) {
                    console.log(`Eliminando ${producto.nombre}`);
                    flag = true
                    if (cantidad >= this.productos[i].cantidad) {
                        this.precioTotal -= this.productos[i].cantidad * producto.precio;
                        this.productos.pop();
                        this.categorias.pop();
                    }
                    else {
                        this.productos[i].cantidad -= cantidad;
                        this.precioTotal -= cantidad * producto.precio;
                    }
                    
                }
            }
            if (flag) {
                resolve();
            }
            else {
                reject();
            }
            }, 3500);
        })
        
    }

}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } 
            else {
                reject(`No existe el producto ${sku}`);
            }

        }, 1500);
    });
}

function eliminandoProducto(sku, cantidad) {
    carrito.eliminarProducto(sku, cantidad)
        .then(() => {
            console.log("Producto eliminado con exito");
        }).catch(() => {
            console.log(`No existe el producto en el carrito`);
        })
}

const carrito = new Carrito();

carrito.agregarProducto('WE328NJ', 10);
carrito.agregarProducto('XX92LKI', 10);


eliminandoProducto('XX92LKI', 11)
eliminandoProducto('WE328NJ', 5)

setTimeout(() => {
    console.log(carrito);
}, 6000);