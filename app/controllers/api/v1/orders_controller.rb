class Api::V1::OrdersController < ApplicationController
  def index
    orders = current_user.orders.includes(:order_items, :payment)
                         .order(created_at: :desc)
                         .page(params[:page]).per(20)

    render json: {
      orders: orders.map { |o| order_json(o) },
      meta: {
        current_page: orders.current_page,
        total_pages: orders.total_pages,
        total_count: orders.total_count
      }
    }
  end

  def show
    order = current_user.orders.includes(:order_items, :payment).find(params[:id])
    authorize order
    render json: { order: order_json(order, detail: true) }
  end

  def create
    cart = current_user.cart
    return render json: { error: "カートが空です" }, status: :unprocessable_entity if cart.cart_items.empty?

    ActiveRecord::Base.transaction do
      order = current_user.orders.create!(
        status: :pending,
        ordered_at: Time.current,
        shipping_name: order_params[:shipping_name],
        shipping_postal_code: order_params[:shipping_postal_code],
        shipping_address: order_params[:shipping_address]
      )

      cart.cart_items.includes(:product).each do |item|
        # 悲観的ロックで在庫の同時更新を防ぐ
        product = Product.lock.find(item.product_id)

        if item.quantity > product.stock
          raise ActiveRecord::RecordInvalid.new(
            order.tap { |o| o.errors.add(:base, "#{product.name}の在庫が不足しています（残り: #{product.stock}個）") }
          )
        end

        order.order_items.create!(
          product: product,
          quantity: item.quantity,
          price_at_purchase: product.price
        )
        product.decrement!(:stock, item.quantity)
      end

      cart.cart_items.destroy_all

      render json: { order: order_json(order, detail: true) }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def order_params
    params.require(:order).permit(:shipping_name, :shipping_postal_code, :shipping_address)
  end

  def order_json(order, detail: false)
    json = {
      id: order.id,
      status: order.status,
      status_label: I18n.t("order.statuses.#{order.status}", default: order.status),
      total: order.total,
      ordered_at: order.ordered_at,
      shipping_name: order.shipping_name,
      shipping_postal_code: order.shipping_postal_code,
      shipping_address: order.shipping_address,
      payment_status: order.payment&.status
    }

    if detail
      json[:items] = order.order_items.includes(:product).map do |item|
        {
          id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          subtotal: item.subtotal,
          product: {
            id: item.product.id,
            name: item.product.name,
            image_url: item.product.image_url
          }
        }
      end
    end

    json
  end
end
