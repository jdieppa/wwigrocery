import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { CartService } from '../shared/services/cart.service';


@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.css']
})
export class ShoppingComponent implements OnInit {
  public categories = [];
  public products;
  public shownitems = [];
  public sortBy = 'None';
  public inStockOnly = false;

  constructor(private productsService: ProductsService,
    private cartService: CartService,
    private router: Router) { }

  ngOnInit() {
    this.productsService.getCategories()
      .subscribe(res => {
        this.categories = res;
      });
      this.products = {};
      this.products.items = [];

    this.showProducts();
  }

  showProducts(subcategory?) {
    this.productsService.getProductsByCategory(subcategory)
      .subscribe(res => {
        this.products = res;
        this.shownitems = this.products.items.slice();
        this.inStockOnly = false;
        this.sortBy = 'None';
      });
  }

  addToCart(product) {
    this.cartService.addItem(product, 1);
    this.router.navigateByUrl('/cart');
  }

  sortProducts() {
    switch ((<string><any>this.sortBy).toLowerCase()) {
      case 'price':
        this.shownitems.sort((a, b) => (a.price < b.price) ? 0 : 1);
        break;
      case 'alphabetical':
        this.shownitems.sort((a, b) => (a.name.localeCompare(b.name)));
        break;
      case 'rating':
        this.shownitems.sort((a, b) => (a.rating < b.rating) ? 0 : 1);
        break;
      default:
        this.shownitems = this.products.items.slice();
        break;
    }
    return this.shownitems;
  }

  filterInStock(e) {
    if (this.inStockOnly) {
      this.shownitems = this.shownitems.filter(x => {
        return (x.stock > 0);
      });
    } else {
      this.shownitems = this.products.items.slice();
    }
    return this.products;
  }
}

