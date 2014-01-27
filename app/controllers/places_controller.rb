class PlacesController < ApplicationController
  def index

    query = params[:q]
    @places = Place.all if query.nil?
    @places = Place.where("LOWER(name) LIKE LOWER(?)", "%"+query+"%") unless query.nil?


    @response = {:count => @places.length, :places => @places}
    respond_to do |format|
      format.json { render json: @response.as_json }
    end
  end
  def search
    query = params[:q]
    @places = Place.all if query.nil?
    @places = Place.where("LOWER(name) LIKE LOWER(?)", "%"+query+"%") unless query.nil?


    @places.map! do |elt|
      logger.debug elt
      elt
    end
    respond_to do |format|
      format.json { render json: @places.as_json }
    end
  end
end
