class Collection < ApplicationRecord
  belongs_to :case

  validates :amount, presense: true
  validates :description, presense: true
end
