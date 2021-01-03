import {Injectable} from "@angular/core";
import {RestService} from "./rest.service";
import {Observable} from "rxjs";
import {ProductNew} from "../models/product-new.model";

@Injectable({
  providedIn: 'root'
})
export class ProductsHttpService {
  constructor(private restService: RestService) {}

  getAllProducts(): Observable<ProductNew[]> {
    return this.restService.read<ProductNew[]>('/products');
  }
  getProduct(id: string): Observable<ProductNew> {
    return this.restService.read<ProductNew>('/products/' + id);
  }
  updateProduct(product: ProductNew): Observable<ProductNew> {
    console.warn(product);
    return this.restService.update<ProductNew>('/products/' + product.id, product);
  }
  createProduct(product: ProductNew): Observable<ProductNew> {
    return this.restService.create<ProductNew>('/products', product);
  }
  deleteProduct(productId: string): Observable<void> {
    return this.restService.delete('/products/' + productId);
  }
}
