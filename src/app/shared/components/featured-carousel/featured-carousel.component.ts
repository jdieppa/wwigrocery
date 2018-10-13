import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-featured-carousel',
  templateUrl: './featured-carousel.component.html',
  styleUrls: ['./featured-carousel.component.css']
})

export class FeaturedCarouselComponent implements OnInit {
  public products = [];
  public featuredProducts = [];

  constructor(private productsService: ProductsService) { }

  ngOnInit() {
    // this.productsService.getProducts().subscribe(res => { this.products = res; });
    this.productsService.getFeaturedProducts()
      .subscribe(res => {
        this.featuredProducts = res;
      });
  }
}
