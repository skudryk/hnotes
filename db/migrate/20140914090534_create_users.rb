class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      #t.string :uuid, :limit => 36, :primary => true
      t.string :username
      t.string :email
      t.string :fullname
      t.boolean :active
      t.timestamps
    end
  end
end
