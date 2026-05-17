class Api::V1::Auth::AdminSessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      admin: {
        id: resource.id,
        name: resource.name,
        email: resource.email
      },
      message: "管理者としてログインしました"
    }, status: :ok
  end

  def respond_to_on_destroy
    render json: { message: "ログアウトしました" }, status: :ok
  end
end
