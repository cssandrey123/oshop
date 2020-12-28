import { ShoppingCart } from './shopping-cart';

export class Order {
    datePlaced: string;
    items: any[];

    constructor(public userId:string, public shipping: any, shoppingCart: ShoppingCart){
        this.datePlaced = new Date().toJSON().slice(0,10).replace(/-/g,'/');

        this.items = shoppingCart.items.map(item => {
            return {
              product: {
                title: item.title,
                imageUrl: item.imageUrl,
                price: item.price
              },
              quantity: item.quantity,
              totalPrice: item.totalPrice
            };
          });
    }
}
