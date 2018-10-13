import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { CartProduct } from '../models/cart-product.model';
import { LocalStorageService, StorageService } from './storage.service';


@Injectable( )

export class CartService {
  private storage: Storage;
  private subscriptionObservable: Observable<Cart>;
  private subscribers: Array<Observer<Cart>> = new Array<Observer<Cart>>();

  constructor(private storageService: LocalStorageService ) {
    this.storage = this.storageService.get();

    this.subscriptionObservable = new Observable<Cart>((observer: Observer<Cart>) => {
      this.subscribers.push(observer);
      observer.next(this.retrieve());
      return () => {
        this.subscribers = this.subscribers.filter((obs) => obs !== observer);
      };
    });
  }

  public get(): Observable<Cart> {
    return this.subscriptionObservable;
  }

  public addItem(product: Product, quantity: number): void {
    const cart = this.retrieve();
    let item = (cart.items) ? cart.items.find((p) => p.product.name === product.name) : undefined;
    if (item === undefined) {
      item = new CartProduct();
      item.product = product;
      item.quantity = quantity;
      cart.items.push(item);
    } else {
      item.quantity += quantity;
    }

    cart.items = cart.items.filter((cartItem) => cartItem.quantity > 0);

    this.calculateCart(cart);
    this.save(cart);
    this.dispatch(cart);
  }

  public removeItem(cartProduct: CartProduct) {
    const cart = this.retrieve();
    cart.items = cart.items.filter(x => x.product.name !== cartProduct.product.name );

    this.calculateCart(cart);
    this.save(cart);
    this.dispatch(cart);
  }

  public updateQuantity(cartProduct: CartProduct) {
    const cart = this.retrieve();
    const item = (cart.items) ? cart.items.find((p) => p.product.name === cartProduct.product.name) : undefined;

    if (cartProduct.quantity > 0) {
      item.quantity = cartProduct.quantity;

      this.calculateCart(cart);
      this.save(cart);
      this.dispatch(cart);
    } else {
      this.removeItem(cartProduct);
    }
  }

  public empty(): void {
    const newCart = new Cart();
    this.save(newCart);
    this.dispatch(newCart);
  }

  private calculateCart(cart: Cart): void {
    cart.subTotal = cart.items
      .map((item) => item.quantity * item.product.price)
      .reduce((previous, current) => previous + current, 0);

    cart.itemCount = (cart.items) ? cart.items.map((x) => x.quantity).reduce((p, n) => p + n, 0) : 0;
    cart.tax = cart.subTotal * cart.taxRate;
    cart.shipping = cart.itemCount * cart.shippingRate;
    cart.total = cart.subTotal + cart.tax + cart.shipping;
  }

  private retrieve(): Cart {
    const cart = new Cart();
    const storedCart = this.storage.getItem('cart');
    if (storedCart) {
      cart.updateFrom(JSON.parse(storedCart));
    } else {
      cart.items = [];
    }
    // console.log('cart-', cart);
    return cart;
  }

  private save(cart: Cart): void {
    this.storage.setItem('cart', JSON.stringify(cart));
  }

  private dispatch(cart: Cart): void {
    this.subscribers
      .forEach((sub) => {
        try {
          sub.next(cart);
        } catch (e) {
          // we want all subscribers to get the update even if one errors.
        }
      });
  }

}
