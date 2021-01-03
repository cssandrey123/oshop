import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecomandedProductsComponent } from './recomanded-products.component';

describe('RecomandedProductsComponent', () => {
  let component: RecomandedProductsComponent;
  let fixture: ComponentFixture<RecomandedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecomandedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecomandedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
