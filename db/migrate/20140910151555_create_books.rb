class CreateBooks < ActiveRecord::Migration
  def change
    create_table :books do |t|
      #t.string :uuid, :limit => 36, :primary => true
      t.string :title
      t.string :category,  default: 'public'
      t.boolean :hidden, default: false
      t.string :shared_to, default: ''
      t.string :password_hash, default: nil
      t.string :password_salt, default: nil
      t.timestamps
    end
  end
end
