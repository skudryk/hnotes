class CreateComments < ActiveRecord::Migration

  def self.up
    create_table :comments do |t|
      t.string :author
      t.text :text
      t.boolean :private, default: false
      t.integer :frame_id
      t.timestamps null: false
    end
    add_foreign_key :comments, :frames
  end
  
  def self.down
    drop_table :comments
  end
  
end
