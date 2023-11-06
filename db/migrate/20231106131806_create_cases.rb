class CreateCases < ActiveRecord::Migration[7.0]
  def change
    create_table :cases do |t|
      t.string :court
      t.string :court_number
      t.references :client, null: false, foreign_key: true

      t.timestamps
    end
  end
end
