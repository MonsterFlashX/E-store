import React, { useEffect, useState } from 'react';
import './Products.css'


function Products({ cart, onAddToCart }) {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        const sortProducts = (data) => {
            if (sortAsc) {
                return data.sort((a, b) => a.price - b.price);
            } else {
                return data.sort((a, b) => b.price - a.price);
            }
        };
    
        fetch(`http://localhost:7000/api/products?q=${searchTerm}`)
            .then((res) => res.json())
            .then((data) => setProducts(sortProducts(data)))
            .catch((err) => console.error("Error fetching orders:", err));
    }, [searchTerm, sortAsc]);

    return (
        <>
            <h1>Products</h1>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => setSortAsc(true)}
                    style={{ marginRight: '10px' }}
                >
                    Sort by Price (Low to High)
                </button>
                <button
                    onClick={() => setSortAsc(false)}
                >
                    Sort by Price (High to Low)
                </button>
            </div>

            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search...'
            >
            </input>

            <main>
                    {products.map((product) => (
                        <div key={product.id}
                            className="product">
                            <img src={'./src/assets/' + product.image}
                                width={200}
                                height={200} />
                            <h2>{product.name}</h2>
                            <h3>Price: {product.price}$</h3>
                            <p>stock: {product.stock}</p>
                            <button onClick={() => {
                                if (product.stock === 0) {
                                    alert("This product is not available at the moment!")
                                } else {
                                    onAddToCart(product)
                                }
                            }
                            }>Add to cart</button>
                        </div>
                    ))}
            </main>
        </>
    );
}

export default Products;