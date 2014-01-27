class CreateAbbreviations < ActiveRecord::Migration
  def change
    create_table :abbreviations do |t|
      t.string :orig_term
      t.string :new_term

      t.timestamps
    end
  end
end
