class Api::V1::Admin::OrdersController < Api::V1::Admin::BaseController
  def index
    orders = Order.includes(:user, :order_items, :payment)
                  .order(created_at: :desc)
                  .page(params[:page]).per(params[:per] || 20)

    orders = orders.where(status: params[:status]) if params[:status].present?

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
    order = Order.includes(:user, :order_items, :payment).find(params[:id])
    render json: { order: order_json(order, detail: true) }
  end

  def update
    order = Order.find(params[:id])

    unless Order.statuses.key?(params[:status].to_s)
      return render json: { error: "無効なステータス値です" }, status: :unprocessable_entity
    end

    order.update!(status: params[:status])
    render json: { order: order_json(order), message: "注文ステータスを更新しました" }
  end

  private

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
      payment_status: order.payment&.status,
      user: { id: order.user.id, name: order.user.name, email: order.user.email }
    }

    if detail
      json[:items] = order.order_items.includes(:product).map do |item|
        {
          id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          subtotal: item.subtotal,
          product: { id: item.product.id, name: item.product.name }
        }
      end
    end

    json
  end
end
