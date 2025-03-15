import { useState } from 'react'
import './App.css'
import Navbar from './Navbar'
import Cart from './Cart'
import Products from './Products'
import Orders from './Orders'
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';

function App() {
  const [cart, setCart] = useState([]);

  const getItemIndex = (cart, id) => {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId == id) {
        return i;
      }
    }
    return -1;
  }

  const addToCart = (newProduct) => {
    let cartItem = {};
    let itemIndex = getItemIndex(cart, newProduct.id);

    if (itemIndex > -1) {
      let newQuantity = cart[itemIndex].quantity + 1;
      cartItem = {
        productId: newProduct.id,
        productName: newProduct.name,
        price: newProduct.price,
        quantity: newQuantity,
        totalPrice: newProduct.price * newQuantity,
      }
      let newCart = cart;
      newCart[itemIndex] = cartItem;
      setCart(newCart);
    } else {
      cartItem = {
        productId: newProduct.id,
        productName: newProduct.name,
        price: newProduct.price,
        quantity: 1,
        totalPrice: newProduct.price,
      }
      setCart([
        ...cart,
        cartItem,
      ]);
    }
  }

  const removeCartItem = (cartItem) => {
    let newCart = cart;
    newCart.pop(cartItem);
    setCart([...newCart]);
  }

  const emptyCart = () => {
    setCart([]);
  }


  return (
    <>
      <BrowserRouter>
        <div>
          <Navbar cart={cart} />
          <Routes>
            <Route path="/" element={<Products cart={cart} onAddToCart={addToCart} />} />
            <Route path="/products" element={
              <Products
                cart={cart}
                onAddToCart={addToCart}
              />}
            />
            <Route path="/cart" element={
              <Cart cart={cart}
                onRemove={removeCartItem}
                onEmptyCart={emptyCart}
              />
            } />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App