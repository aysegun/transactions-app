class CreateTransactionCases < ActiveRecord::Migration[7.0]
  def change
    create_table :transaction_cases do |t|
      t.references :transaction, null: false, foreign_key: true
      t.references :case, null: false, foreign_key: true

      t.timestamps
    end
  end
end
