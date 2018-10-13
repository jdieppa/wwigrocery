import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CartService } from '../shared/services/cart.service';
import { CartProduct } from '../shared/models/cart-product.model';
import { Cart } from '../shared/models/cart.model';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  public cartObservable: Observable<Cart>;
  public cart: Cart;
  public person;
  public submitted;

  private cartSubscription: Subscription;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartObservable = this.cartService.get();
    this.cartSubscription = this.cartObservable.subscribe((cart) => {
      this.cart = cart;
    });
    this.person = {};
    this.person.name = '';
    this.person.address = '';
    this.person.city = '';
    this.person.phone = '';
    this.submitted = false;
  }

  public emptyCart(): void {
    this.cartService.empty();
  }

  public updateQuantity (cartProduct: CartProduct) {
    this.cartService.updateQuantity(cartProduct);
  }

  public removeItem(cartProduct: CartProduct) {
    this.cartService.removeItem(cartProduct);
  }

  public preSubmit() {
    this.submitted = true;
  }

  public onSubmit() {
    document.getElementById('checkoutModalButton').click(); // there has to be a better way to do this
  }
}
