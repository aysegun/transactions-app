class Transaction < ApplicationRecord
  belongs_to :client
  has_many :transaction_cases, dependent: :destroy
  has_many :cases, through: :transaction_cases, dependent: :destroy

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }

  attr_accessor :court, :court_number

  after_create :associate_case_if_expense

  private

  def associate_case_if_expense
    if expense?
      transaction_cases.create(case: Case.find_or_create_by(court: court, court_number: court_number, client: client))
    end
  end
end
