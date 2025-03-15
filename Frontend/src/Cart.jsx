import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Cart.css'

function Cart({ cart, onEmptyCart, onRemove }) {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Thank you for your purchase!");
        onEmptyCart();
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setMessage("Failed to process order. Please try again.");
    }
  };

  const getTotal = () => {
    let total = 0;
    cart.forEach(item => {
      total += item.totalPrice;
    })
    return total;
  }

  return (
    <>
      <h1>Cart</h1>
      {cart.length > 0 ?
        (<div>
          <table className='table'>
            <thead>
              <tr className='even-rows'>
                <th className='th'>Id</th>
                <th className='th'>Name</th>
                <th className='th'>Item price</th>
                <th className='th'>Count</th>
                <th className='th'>Total Price</th>
                <th className='th'></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((cartItem) => (
                <tr key={cartItem.productId}>
                  <td>{cartItem.productId}</td>
                  <td>{cartItem.productName}</td>
                  <td>{cartItem.price}$</td>
                  <td>{cartItem.quantity}</td>
                  <td>{cartItem.totalPrice}$</td>
                  <td><button onClick={() => {
                    onRemove(cartItem)
                  }}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Total: {getTotal()} $</h2>
          <button onClick={handleCheckout}>Checkout</button>
          <button onClick={() => {
            onEmptyCart();
            navigate("/products");
          }
          }>Empty cart</button>

        </div>) : <p>Cart is empty</p>
      }




      {message && <p>{message}</p>}

    </>
  );
}

export default Cart;