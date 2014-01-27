class AddTermsColumnToPlace < ActiveRecord::Migration
  def change
    add_column :places, :terms, :text
  end
end
