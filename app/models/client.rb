class Client < ApplicationRecord
  has_many :transactions, dependent: :destroy
  has_many :cases, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true

  def balance
    total_payments = transactions.where(transaction_type: 'payment').sum(:amount)
    total_expenses = transactions.where(transaction_type: 'expense').sum(:amount)
    total_payments - total_expenses
  end
end
