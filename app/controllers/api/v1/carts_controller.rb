class Api::V1::CartsController < ApplicationController
  def show
    cart = current_user.cart || current_user.create_cart
    render json: { cart: cart_json(cart) }
  end

  private

  def cart_json(cart)
    {
      id: cart.id,
      total: cart.total,
      item_count: cart.item_count,
      items: cart.cart_items.includes(:product).map { |item| cart_item_json(item) }
    }
  end

  def cart_item_json(item)
    {
      id: item.id,
      quantity: item.quantity,
      subtotal: item.subtotal,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        image_url: item.product.image_url
      }
    }
  end
end
