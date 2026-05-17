class Order < ApplicationRecord
  belongs_to :user
  has_many   :order_items, dependent: :destroy
  has_many   :products, through: :order_items
  has_one    :payment, dependent: :destroy

  enum :status, {
    pending:    0,
    processing: 1,
    shipped:    2,
    delivered:  3,
    cancelled:  4
  }

  validates :user, :status, presence: true
  validates :shipping_name, :shipping_postal_code, :shipping_address, presence: true

  def total
    order_items.sum("price_at_purchase * quantity").to_i
  end
end