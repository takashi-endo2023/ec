class Payment < ApplicationRecord
  belongs_to :order

  enum :status, { pending: 0, completed: 1, failed: 2 }

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true
end
