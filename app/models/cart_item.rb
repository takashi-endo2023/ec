class CartItem < ApplicationRecord
  belongs_to :product
  belongs_to :cart

  validates :quantity, presence: true, numericality: { greater_than: 0 }

  def subtotal
    product.price * quantity
  end
end