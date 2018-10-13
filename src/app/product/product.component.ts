import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { CartService } from '../shared/services/cart.service';
import { Product } from '../shared/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [CartService]
})
export class ProductComponent implements OnInit {
  public product: Product;
  public productName: string;
  public quantity: number;

  constructor(private productsService: ProductsService,
              private cartService: CartService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.productName = this.route.snapshot.paramMap.get('name');
    this.product = <Product>{name: '', imagelink: ''}; // is there a better way to set these initial values?
    this.quantity = 1;
    this.getProduct();
  }

  getProduct() {
    return this.productsService.getProduct(this.productName).subscribe(res => this.product = res);
  }

  addToCart() {
    this.cartService.addItem(this.product, this.quantity);
    this.router.navigateByUrl('/cart');
  }
}
