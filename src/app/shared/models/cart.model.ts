import { CartProduct } from './cart-product.model';

export class Cart {
  items: CartProduct[] = [];
  itemCount = 0;
  subTotal = 0;
  taxRate = 0.04;
  tax = 0;
  shippingRate = 1.25;
  shipping = 0;
  total = 0;

  public updateFrom(src: Cart) {
    this.items = src.items;
    this.itemCount = src.itemCount;
    this.subTotal = src.subTotal;
    this.taxRate = src.taxRate;
    this.tax = src.tax;
    this.shippingRate = src.shippingRate;
    this.shipping = src.shipping;
    this.total = src.total;
  }
}
