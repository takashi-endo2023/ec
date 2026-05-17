class Api::V1::PaymentsController < ApplicationController
  def create
    # 悲観的ロックで二重決済を防ぐ
    order = current_user.orders.lock.find(params[:order_id])
    authorize order, :pay?

    if order.payment.present?
      return render json: { error: "この注文は既に支払い済みです" }, status: :unprocessable_entity
    end

    ActiveRecord::Base.transaction do
      payment = order.create_payment!(
        amount: order.total,
        status: :completed,
        payment_method: params[:payment_method] || "mock_credit_card",
        transaction_id: SecureRandom.uuid
      )
      order.update!(status: :processing)

      render json: {
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          transaction_id: payment.transaction_id
        },
        order: { id: order.id, status: order.status },
        message: "お支払いが完了しました"
      }, status: :created
    end
  rescue ActiveRecord::RecordNotUnique
    render json: { error: "この注文は既に支払い済みです" }, status: :unprocessable_entity
  end
end
