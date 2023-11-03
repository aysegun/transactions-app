class Transaction < ApplicationRecord
  belongs_to :client

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }
end
