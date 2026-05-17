class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :product

  validates :quantity, :price_at_purchase, presence: true
  validates :quantity, numericality: { greater_than: 0 }

  def subtotal
    price_at_purchase * quantity
  end
end