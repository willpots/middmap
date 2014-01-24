class Event < ActiveRecord::Base
  belongs_to :place

  def as_json(options={})
    super(options.merge(:include => [:place]))
  end
end
