class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items

  def total
    cart_items.joins(:product).sum("products.price * cart_items.quantity").to_i
  end

  def item_count
    cart_items.sum(:quantity)
  end
end