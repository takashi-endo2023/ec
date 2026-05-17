class OrderPolicy < ApplicationPolicy
  def index?   = true
  def show?    = record.user == user
  def create?  = true
  def pay?     = record.user == user && record.payment.nil?
end
