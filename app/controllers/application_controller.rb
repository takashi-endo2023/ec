class ApplicationController < ActionController::API
  include Pundit::Authorization

  before_action :authenticate_user!, unless: :skip_authentication?

  rescue_from Pundit::NotAuthorizedError, with: :render_forbidden
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid do |e|
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def skip_authentication?
    admin_request? || devise_controller?
  end

  def admin_request?
    request.path.start_with?("/api/v1/admin")
  end

  def render_forbidden
    render json: { error: "このリソースへのアクセス権限がありません" }, status: :forbidden
  end

  def render_not_found
    render json: { error: "リソースが見つかりません" }, status: :not_found
  end
end
