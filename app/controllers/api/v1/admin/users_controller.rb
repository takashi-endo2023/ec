class Api::V1::Admin::UsersController < Api::V1::Admin::BaseController
  def index
    users = User.order(created_at: :desc).page(params[:page]).per(20)
    render json: {
      users: users.map { |u| user_json(u) },
      meta: {
        current_page: users.current_page,
        total_pages: users.total_pages,
        total_count: users.total_count
      }
    }
  end

  def show
    user = User.find(params[:id])
    render json: { user: user_json(user, detail: true) }
  end

  private

  def user_json(user, detail: false)
    json = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      orders_count: user.orders.count
    }

    if detail
      json.merge!(
        phone: user.phone,
        prefecture: user.prefecture,
        municipality: user.municipality,
        address: user.address
      )
    end

    json
  end
end
