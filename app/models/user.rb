class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  has_one  :cart, dependent: :destroy
  has_many :orders, dependent: :destroy

  enum :gender, { unspecified: 0, male: 1, female: 2, other: 3 }, prefix: true

  validates :name, presence: true

  after_create :create_cart
end
