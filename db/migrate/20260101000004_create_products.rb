class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string  :name,        null: false
      t.text    :description
      t.integer :price,       null: false
      t.integer :stock,       null: false, default: 0
      t.string  :category

      t.timestamps
    end

    add_index :products, :category
    add_index :products, :name
  end
end
