export async function getOrders(){
    const url = 'http://localhost:3000/api/orders'; // get all Orders

    const res = await fetch(url);
    const data = await res.json();

    return data;
}

export async function newProducts(orders) {
    const url = 'http://localhost:3000/api/products' // get new Products

    const res = await fetch(url, (
        method: "POST",
        body: JSON.stringify(orders);
        headers: {
            "Content-type": "application/json; charset=UTF-8" 
        }
    ));
    res.json();
}
