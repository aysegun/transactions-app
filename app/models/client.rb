class Client < ApplicationRecord
  has_many :transactions, dependent: :destroy

  def balance
    total_payments = transactions.where(transaction_type: 'payment').sum(:amount)
    total_expenses = transactions.where(transaction_type: 'expense').sum(:amount)
    total_payments - total_expenses
  end
end
