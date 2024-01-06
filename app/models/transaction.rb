class Transaction < ApplicationRecord
  belongs_to :client
  has_many :transaction_cases, dependent: :destroy
  has_many :cases, through: :transaction_cases

  validates :amount, presence: true
  validates :transaction_type, presence: true

  enum transaction_type: { expense: 'expense', payment: 'payment' }

  attr_accessor :court, :court_number

  after_create :associate_case_if_expense

  private

  # def associate_case_if_expense
  #   return unless expense?

  #   last_transaction_case = transaction_cases.last
  #   selected_case_id = last_transaction_case&.case_id

  #   if selected_case_id.present?
  #     transaction_cases.create(case: Case.find(selected_case_id))
  #   else
  #     new_case = Case.find_or_create_by(court: court, court_number: court_number, client: client)
  #     transaction_cases.create(case: new_case)
  #   end
  # end
  def associate_case_if_expense
    return unless expense?

    last_transaction_case = transaction_cases.last
    selected_case_id = last_transaction_case&.case_id

    if selected_case_id.present?
      # Do nothing, as the case is already associated with the transaction
    else
      existing_case = Case.find_by(court: court, court_number: court_number, client: client)

      if existing_case.present?
        transaction_cases.create(case: existing_case)
      else
        new_case = Case.create(court: court, court_number: court_number, client: client)
        transaction_cases.create(case: new_case)
      end
    end
  end
end
