class Transaction < ApplicationRecord
  belongs_to :client

  enum transaction_type: { expense: 'expense', payment: 'payment' }
end
