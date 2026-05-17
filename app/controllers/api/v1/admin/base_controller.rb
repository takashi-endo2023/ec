class Api::V1::Admin::BaseController < ActionController::API
  before_action :authenticate_admin!

  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def render_not_found
    render json: { error: "リソースが見つかりません" }, status: :not_found
  end
end
