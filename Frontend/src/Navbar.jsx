import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

function Navbar(props) {
    const { cart, onAddToCart } = props;

    return (
        <>
            <nav>
                <ul className="nav-list">
                    <li className="nav-item">
                        <Link to="/products">Products</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/cart">Cart ({cart.length})</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/orders">Orders</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}
 
export default Navbar;