class CreatePages < ActiveRecord::Migration
  def change
    create_table :pages do |t|
      #t.string :uuid, :limit => 36, :primary => true
      t.string :title
      t.string :position, default: 'top'
      t.integer :parent_id
      t.string  :parent_type, default: 'Page'
      t.string  :shared_to
      t.boolean :hidden, default: false
      t.string :password_hash, default: nil
      t.string :password_salt, default: nil
      t.timestamps
    end
  end
end
