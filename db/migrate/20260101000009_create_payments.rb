class CreatePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :payments do |t|
      t.references :order,  null: false, foreign_key: true, index: false
      t.integer    :amount, null: false
      t.integer    :status, null: false, default: 0
      t.string     :payment_method
      t.string     :transaction_id

      t.timestamps
    end

    add_index :payments, :order_id, unique: true
    add_index :payments, :transaction_id, unique: true
  end
end
