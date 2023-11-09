class TransactionCase < ApplicationRecord
  # belongs_to :transaction
  belongs_to :related_transaction, class_name: 'Transaction', foreign_key: 'transaction_id'
  belongs_to :case
end
