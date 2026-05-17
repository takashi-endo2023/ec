class Api::V1::CartItemsController < ApplicationController
  before_action :set_cart

  def create
    item = @cart.cart_items.find_or_initialize_by(product_id: params[:product_id])
    quantity = params[:quantity].to_i
    quantity = 1 if quantity < 1

    if item.new_record?
      item.quantity = quantity
    else
      item.quantity += quantity
    end

    product = Product.find(params[:product_id])
    if item.quantity > product.stock
      return render json: { error: "在庫が不足しています（在庫: #{product.stock}個）" }, status: :unprocessable_entity
    end

    item.save!
    render json: { cart: cart_json(@cart.reload) }, status: :created
  end

  def update
    item = @cart.cart_items.find(params[:id])
    quantity = params[:quantity].to_i

    if quantity <= 0
      item.destroy
    else
      if quantity > item.product.stock
        return render json: { error: "在庫が不足しています（在庫: #{item.product.stock}個）" }, status: :unprocessable_entity
      end
      item.update!(quantity: quantity)
    end

    render json: { cart: cart_json(@cart.reload) }
  end

  def destroy
    @cart.cart_items.find(params[:id]).destroy
    render json: { cart: cart_json(@cart.reload) }
  end

  private

  def set_cart
    @cart = current_user.cart || current_user.create_cart
  end

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
