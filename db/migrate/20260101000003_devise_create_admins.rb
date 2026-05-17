class DeviseCreateAdmins < ActiveRecord::Migration[8.0]
  def change
    create_table :admins do |t|
      t.string :name,              null: false, default: ""
      t.string :email,             null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      # JWT revocation
      t.string :jti, null: false

      t.timestamps null: false
    end

    add_index :admins, :email, unique: true
    add_index :admins, :jti,   unique: true
  end
end
