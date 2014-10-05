class CreateActivityLogs < ActiveRecord::Migration

  def change
    create_table :activity_logs do |t|
      t.string :action
      t.string :path
      t.string :who
      t.timestamps
    end
  end

end
