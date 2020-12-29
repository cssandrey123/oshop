export class ShoppingCartItem {
    id:string;
    title:string;
    imageUrlInHex: string;
    price: number;
    quantity: number;

    constructor(init?: Partial<ShoppingCartItem>){
        Object.assign(this,init);
    }
    get totalPrice(){return this.price * this.quantity}
}
