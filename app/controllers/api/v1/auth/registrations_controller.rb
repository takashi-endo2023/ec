class Api::V1::Auth::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    ActiveRecord::Base.transaction do
      resource.save!
      # after_create で cart が作られるが、失敗時もここでロールバック
      token, _payload = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil)
      response.headers['Authorization'] = "Bearer #{token}"
      render json: {
        user: { id: resource.id, name: resource.name, email: resource.email },
        message: "アカウントを作成しました"
      }, status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
  end

  private

  def sign_up_params
    params.require(:user).permit(
      :email, :password, :password_confirmation,
      :name, :phone, :gender, :birth_day,
      :postal_code, :prefecture, :municipality, :address, :building
    )
  end
end
