class CreateCollections < ActiveRecord::Migration[7.0]
  def change
    create_table :collections do |t|
      t.date :date
      t.decimal :amount
      t.text :description
      t.references :case, null: false, foreign_key: true

      t.timestamps
    end
  end
end
