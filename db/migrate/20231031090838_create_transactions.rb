class CreateTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :transactions do |t|
      t.decimal :amount
      t.text :type
      t.text :description
      t.date :date
      t.references :client, null: false, foreign_key: true

      t.timestamps
    end
  end
end
