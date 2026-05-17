class Product < ApplicationRecord
  has_one_attached :image

  has_many :cart_items, dependent: :destroy
  has_many :order_items, dependent: :destroy

  validates :name, :price, :stock, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, numericality: { greater_than_or_equal_to: 0 }

  scope :in_stock, -> { where("stock > 0") }
  scope :by_category, ->(cat) { where(category: cat) if cat.present? }
  scope :search, lambda { |keyword|
    if keyword.present?
      escaped = keyword.gsub(/[\\%_]/, '\\\\\0')
      where("name LIKE ? OR description LIKE ?", "%#{escaped}%", "%#{escaped}%")
    end
  }

  def image_url
    return nil unless image.attached?
    Rails.application.routes.url_helpers.rails_blob_url(image, only_path: true)
  end
end
