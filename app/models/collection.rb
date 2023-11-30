class Collection < ApplicationRecord
  belongs_to :case

  validates :amount, presence: true
  validates :description, presence: true
end
