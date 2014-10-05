class AddFieldsToFrames < ActiveRecord::Migration
    
  def up
    add_column :frames, :hidden, :boolean, default: false
    add_column :frames, :content, :text
    add_column :frames, :coord_x, :integer
    add_column :frames, :coord_y, :integer
    add_column :frames, :tags, :string
    add_index :frames, [:tags, :content, :category]
  end
  
  def down
    remove_column :frames, :content
    remove_column :frames, :coord_x
    remove_column :frames, :coord_y
    remove_column :frames, :tags
    remove_index :frames, [:tags, :content, :category]
  end
  
end
