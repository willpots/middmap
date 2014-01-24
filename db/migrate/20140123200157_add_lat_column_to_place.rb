class AddLatColumnToPlace < ActiveRecord::Migration
  def change
    add_column :places, :lat, :float
    add_column :places, :lng, :float

  end
end
