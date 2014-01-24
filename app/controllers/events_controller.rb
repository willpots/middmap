class EventsController < ApplicationController
  def index
    @events = Event.where("start >= ?", Time.now)
    @response = { :count => @events.length, :events => @events }
    respond_to do |format|
      # format.html { render action: 'edit' }
      format.json { render json: @response.as_json }
    end
  end
end
