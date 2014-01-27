class AddRawLocationColumnToEvent < ActiveRecord::Migration
  def change
    add_column :events, :raw_location, :string
  end
end
