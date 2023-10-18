const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            product.id = newId;
            products.push(product);
            await this.saveProducts(products);
            return product;
        } catch (error) {
            throw new Error('Error al agregar producto: ' + error.message);
        }
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Si el archivo todavio no existe, devuelve un array vacio
                return [];
            } else {
                throw new Error('Error al leer productos: ' + error.message);
            }
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async updateProduct(id, updatedProduct) {
        try {
            let products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                // Modificar el producto con la nueva informacion
                products[productIndex] = { ...products[productIndex], ...updatedProduct };
                await this.saveProducts(products);
                return products[productIndex];
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error('Error el modificar producto: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            let products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === id);
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                await this.saveProducts(products);
                return true;
            } else {
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }

    async saveProducts(products) {
        const data = JSON.stringify(products, null, 2);
        await fs.promises.writeFile(this.path, data);
    }
}

// Ejemplo:
const productManager = new ProductManager('products.json');

// Agregar nuevo producto
productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripcion del Product 1',
    price: 19.99,
    thumbnail: 'producto1.jpg',
    code: 'P001',
    stock: 100
});

// Obtiene todos los productos
productManager.getProducts().then(console.log);

// Obtiene productos por id
productManager.getProductById(1).then(console.log);

// Modificar producto
productManager.updateProduct(1, { price: 24.99 }).then(console.log);

// Eliminar producto
productManager.deleteProduct(1).then(console.log);
