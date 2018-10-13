import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {
  private dataUrl = 'https://webmppcapstone.blob.core.windows.net/data/itemsdata.json';
  public allData;
  public product: ReplaySubject<any> = new ReplaySubject(1);
  public products: ReplaySubject<any> = new ReplaySubject(1);
  public featuredProducts: ReplaySubject<any> = new ReplaySubject(1);
  public categories: ReplaySubject<any> = new ReplaySubject(1);
  public subCategories: ReplaySubject<any> = new ReplaySubject(1);

  constructor(private http: HttpClient) {
    this.allData = this.http.get(this.dataUrl);
  }

  public getAll() {
    return this.allData;
  }

  public getProduct(productName: string) {
    this.allData.subscribe(res => {
      let product: Product;
      res.map((current) => {
        current.subcategories.map((current2) => {
          for (const item of current2.items) {
            if (item.name === productName) {
              product = item;
            }
          }
        });
      });
      this.product.next(product);
    });
    return this.product;
  }

  public getProducts() {
    this.allData.subscribe(res => {
      let productsList = [];
      res.map((current) => {
        current.subcategories.map((current2) => {
          productsList = productsList.concat(current2.items);
        });
      });
      this.products.next(productsList);
    });
    return this.products;
  }

  public getFeaturedProducts() {
    this.getProducts();
    this.products.subscribe(res => {
      this.featuredProducts.next(this.shuffle(res).slice(0, 5));
    });
    return this.featuredProducts;
  }

  public getCategories() {
    this.allData.subscribe(res => {
      const categoryList = [];
      res.map((current) => {
        categoryList.push(current);
      });

      this.categories.next(categoryList);
    });
    return this.categories;
  }

  public getProductsByCategory(subcategory: string) {
    this.allData.subscribe(res => {
      let products;

      if (subcategory === undefined) {
        products = res[0].subcategories[0];
      } else {
        res.map((current) => {
          current.subcategories.map((current2) => {
            if (current2.name === subcategory) {
              products = current2;
            }
          });
        });
      }
      this.subCategories.next(products);
    });
    return this.subCategories;
  }

  private shuffle(inArray) {
    const a: any = inArray.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

}
