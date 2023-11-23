class Client < ApplicationRecord
  has_many :transactions, dependent: :destroy
  has_many :cases, dependent: :destroy

  validates :first_name, presence: true
  validates :last_name, presence: true

  include PgSearch::Model
  pg_search_scope :search_by_first_name_and_last_name,
    against: %i[ first_name last_name ],
    using: {
      tsearch: { prefix: true }
    }

  def balance
    total_payments = transactions.where(transaction_type: 'payment').sum(:amount)
    total_expenses = transactions.where(transaction_type: 'expense').sum(:amount)
    total_payments - total_expenses
  end
end
