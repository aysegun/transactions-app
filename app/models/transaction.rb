class Transaction < ApplicationRecord
  belongs_to :client
  belongs_to :case, optional: true

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }

  after_create :associate_case_if_expense

  private

  def associate_case_if_expense
    if transaction_type == 'expense'
      create_case(court: 'YourCourtName', court_number: 'YourCourtNumber')
    end
  end
end
