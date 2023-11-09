class Transaction < ApplicationRecord
  belongs_to :client
  has_many :transaction_cases
  has_many :cases, through: :transaction_cases

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }

  after_create :associate_case_if_expense

  private

  def associate_case_if_expense
    if expense?
      case_record = Case.create(
        court: self['court'],
        court_number: self['court_number'],
        client: client
      )
      self.cases << case_record
    end
  end
end
