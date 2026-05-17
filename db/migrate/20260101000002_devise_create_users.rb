class DeviseCreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at

      # Profile
      t.string :name,          null: false, default: ""
      t.string :phone
      t.date   :birth_day
      t.integer :gender        # 0: unspecified, 1: male, 2: female, 3: other
      t.string :postal_code
      t.string :prefecture
      t.string :municipality
      t.string :address
      t.string :building

      # JWT revocation
      t.string :jti, null: false

      t.timestamps null: false
    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :jti,                  unique: true
  end
end
