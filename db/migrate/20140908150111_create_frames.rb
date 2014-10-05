class CreateFrames < ActiveRecord::Migration

 def change
    create_table :frames do |t|
      #t.string :uuid, :limit => 36, :primary => true
      t.integer  :parent_id
      t.string :name
      t.string :category
      t.integer :position
      t.text :body
      t.timestamps
    end
  end

end
