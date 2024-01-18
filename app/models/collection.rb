class Collection < ApplicationRecord
  belongs_to :case

  validates :amount, presence: true
  validates :description, presence: true

  def calculation_amount(selected_ratio)
    case selected_ratio
    when '9,1%'
      amount * 9.1 / 100
    when '4,55%'
      amount * 4.55 / 100
    when '2,7%'
      amount * 2.7 / 100
    when 'none'
      amount
    else
      amount
    end
  end
end
