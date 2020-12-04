import { Component, OnInit, Input } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  categories$;
  constructor(public categoryService: CategoryService) { }
  @Input() category;
  ngOnInit(): void {
    this.categories$ = this.categoryService.getAll();
  }

}
