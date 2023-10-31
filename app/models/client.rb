class Client < ApplicationRecord
  has_many :transactions, dependent: :destroy
end
