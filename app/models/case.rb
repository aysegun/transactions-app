class Case < ApplicationRecord
  belongs_to :client
  has_many :transaction_cases, dependent: :destroy
  has_many :transactions, through: :transaction_cases
  has_many :collections, dependent: :destroy

  include PgSearch::Model
  multisearchable against: %i[court court_number]
end
