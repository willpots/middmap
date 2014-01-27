class AddTimeColumnToEvent < ActiveRecord::Migration
  def change
    add_column :events, :s_time, :datetime
    add_column :events, :e_time, :datetime
  end
end
