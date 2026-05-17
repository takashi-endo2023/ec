class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.references :user,   null: false, foreign_key: true
      t.integer    :status, null: false, default: 0
      t.datetime   :ordered_at
      t.string     :shipping_name,        null: false, default: ""
      t.string     :shipping_postal_code, null: false, default: ""
      t.string     :shipping_address,     null: false, default: ""

      t.timestamps
    end

    add_index :orders, :status
    add_index :orders, :ordered_at
  end
end
