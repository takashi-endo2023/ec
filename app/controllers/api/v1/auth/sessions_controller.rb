class Api::V1::Auth::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    render json: {
      user: {
        id: resource.id,
        name: resource.name,
        email: resource.email
      },
      message: "ログインしました"
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: { message: "ログアウトしました" }, status: :ok
    else
      render json: { message: "ログアウトしました" }, status: :ok
    end
  end
end
