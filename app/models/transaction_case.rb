class TransactionCase < ApplicationRecord
  belongs_to :related_transaction, class_name: 'Transaction', foreign_key: 'transaction_id', dependent: :destroy
  belongs_to :case
end
