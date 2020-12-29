import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
    items: ShoppingCartItem[] = [];
    constructor(private itemsMap: ShoppingCartItem[] ) {
        this.itemsMap = itemsMap || [];
        for(const productId in itemsMap) {
            const item = itemsMap[productId];

            this.items.push(new ShoppingCartItem({
                ...item,
                id: productId
            }));
        }
    }
    get productIds(){
        return Object.keys(this.itemsMap);
    }
    get totalItemsCount() {
        let count = 0;
      for(let productId in this.itemsMap) {
        count += this.itemsMap[productId].quantity;
      }
      return count;
    }
    get totalPrice(){
        let sum = 0;
        for (let productId in this.items) {
            sum += this.items[productId].totalPrice;
        }
        return sum;
    }
    getQuantity(product) {
        let item = this.itemsMap[product.id];
        return item ? item.quantity : 0;
      }

}
