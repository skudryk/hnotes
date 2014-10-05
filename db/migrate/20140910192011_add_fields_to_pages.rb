class AddFieldsToPages < ActiveRecord::Migration
    
  def up
    add_column :pages, :category, :string, default: "html"
    add_column :pages, :tags, :string
  end
  
  def down
    remove_column :pages, :hidden
    remove_column :pages, :category
    remove_column :pages, :tag
  end
end
