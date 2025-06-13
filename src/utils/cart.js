// export default function getCart() {
//   let cart = localStorage.getItem("cart");
//   if (cart == null) {
//     cart = [];
//     localStorage.setItem("cart", JSON.stringify(cart));
//     return [];
//   }
//   cart = JSON.parse(cart);
//   return cart;
// }

// export function addToCart(productId, qty) {
//   let cart = getCart();

//   const productIndex = cart.findIndex(
//     (prdct) => prdct.productId === product.productId
//   );
//   if (productIndex == -1) {
//     cart.push({
//       productId: productId.productId,
//       name: productId.name,
//       altName: productId.altName,
//       price: productId.price,
//       labeledPrice: productId.labeledPrice,
//       images: productId.images[0],
//       quantity: qty,
//     });
//   }else{
//     cart[productIndex].quantity += qty;
//     if(cart[productIndex].quantity<=0){
//       cart=cart.filter((product) => product.productId !== product.productId);
//     }
//   }
//   localStorage.setItem("cart", JSON.stringify(cart));
//   return cart;
// }

// export function removeFromCart(productId) {
//   let cart = getCart();
//   cart = cart.filter((product) => product.productId !== productId);
//   localStorage.setItem("cart", JSON.stringify(cart));
//   return cart;
// }

export default function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart == null) {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    return [];
  }
  return JSON.parse(cart);
}

export function addToCart(product, qty) {
  const cart = getCart();

  // Find existing product in cart by matching productId
  const productIndex = cart.findIndex(
    (item) => item.productId === product.productId
  );

  if (productIndex === -1) {
    // Add new product entry
    cart.push({
      productId: product.productId,
      name: product.name,
      altName: product.altName,
      price: product.price,
      labeledPrice: product.labeledPrice,
      images: product.images[0],
      quantity: qty,
    });
  } else {
    // Update quantity for existing product
    cart[productIndex].quantity += qty;
    // Remove if quantity goes to zero or below
    if (cart[productIndex].quantity <= 0) {
      cart.splice(productIndex, 1);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
}

export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(
    (item) => item.productId !== productId
  );
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return updatedCart;
}


export function getTotal(){
  let cart =getCart();
  let total=0;
  cart.forEach((product) => {
    total += product.price * product.quantity;
  });
  return total;
}


export function getTotalForLabeledPrice(){
  let cart =getCart();
  let total=0;
  cart.forEach((product) => {
    total += product.labeledPrice * product.quantity;
  });
  return total;
}