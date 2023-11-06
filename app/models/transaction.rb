class Transaction < ApplicationRecord
  belongs_to :client
  belong_to :case, if: -> { transaction_type == expense }

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }
end
