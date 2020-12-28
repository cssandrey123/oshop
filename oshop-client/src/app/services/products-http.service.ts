import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
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
}
