import { ShoppingCart } from './shopping-cart';
export interface Shipping {
  name: string;
  phoneNumber: string;
  city: string;
  address: string;
}
export class Item {
  productTitle: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
}
export class Order {
    id: string;
    shippingAddress: string;
    shippingName: string;
    shippingCity: string;
    phoneNumber: string;
    username: string;
    userId: string;
    datePlaced: string;
    items: Item[];
    status = 'PROCESSED';
    expectedDate: string;

    constructor() {}
    createOrder(id: string, name: string, shipping: Shipping, shoppingCart: ShoppingCart) {
        this.datePlaced = new Date().toJSON().slice(0, 10);
        this.userId = id;
        this.username = name;
        this.items = shoppingCart.items.map(item => {
            const newItem: Item = {
              productPrice: item.price,
              productTitle: item.title,
              quantity: item.quantity,
              totalPrice: item.totalPrice
            };
            return newItem;
          });
        this.shippingAddress = shipping.address;
        this.shippingName = shipping.name;
        this.phoneNumber = shipping.phoneNumber;
        this.shippingCity = shipping.city;
    }
}
