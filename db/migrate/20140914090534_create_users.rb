class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      #t.string :uuid, :limit => 36, :primary => true
      t.string :username
      t.string :email
      t.string :fullname
      t.boolean :active
      t.string :password_hash, default: nil
      t.string :password_salt, default: nil
      t.timestamps
    end
  end
end
