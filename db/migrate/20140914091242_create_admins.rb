class CreateAdmins < ActiveRecord::Migration
  def change
    create_table :admins do |t|
      t.string :email
      t.string :password_hash
      t.string :password_salt
      t.timestamps
      t.string :password_hash, default: nil
      t.string :password_salt, default: nil
    end
  end
end
