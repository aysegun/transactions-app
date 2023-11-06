class Transaction < ApplicationRecord
  belongs_to :client
  belongs_to :case, -> { where transaction_type == 'expense' }

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }
end
