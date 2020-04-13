export default function calcTotalPrice(items) {
  return items.reduce((tally, cartItem) => {
    const isOrderItem = !cartItem.item && cartItem.quantity && cartItem.price; // OrderItem have different structure than CartItem

    if (isOrderItem) {
      return tally + cartItem.quantity * cartItem.price;
    }

    if (!cartItem.item) return tally;
    return tally + cartItem.quantity * cartItem.item.price;
  }, 0);
}
