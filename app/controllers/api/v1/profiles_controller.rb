class Api::V1::ProfilesController < ApplicationController
  def show
    render json: { profile: profile_json(current_user) }
  end

  def update
    if current_user.update(profile_params)
      render json: { profile: profile_json(current_user), message: "プロフィールを更新しました" }
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def profile_params
    params.require(:profile).permit(
      :name, :phone, :gender, :birth_day,
      :postal_code, :prefecture, :municipality, :address, :building
    )
  end

  def profile_json(user)
    {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      birth_day: user.birth_day,
      postal_code: user.postal_code,
      prefecture: user.prefecture,
      municipality: user.municipality,
      address: user.address,
      building: user.building
    }
  end
end
