import React, { useEffect, useState } from "react";
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    setOrdersLoading(true);
    fetch("http://localhost:7000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data)
        setOrdersLoading(false);
      }
      )
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {
        orders.length === 0 ? (
          ordersLoading ? (
            <p>Orders Loading...</p>
          ) : <p>No orders placed yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId}>
              <p>Order #{order.orderId}, Total: ${order.total}</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={item.id}
                    class="order-item">
                    {item.productName} - ${item.price} x {item.quantity}
                  </li>
                ))}
              </ul>
              <hr />
            </div>
          ))
        )
      }
    </div>
  );
};

export default Orders;