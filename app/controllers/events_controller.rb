require 'feedzirra'
require 'net/http'

class EventsController < ApplicationController
  include EventsHelper

  def index
    @events = Event.where("s_time >= ?", Time.now)
    @response = { :count => @events.length, :events => @events }
    respond_to do |format|
      # format.html { render action: 'edit' }
      format.json { render json: @response.as_json }
    end
  end

  def college
    feed = Feedzirra::Feed.fetch_and_parse("http://25livepub.collegenet.com/calendars/featured-title-events-calendar-search.rss")
    entries = []
    locations = {}
    feed.entries.each do |e|
      summary = e.summary.split(/<br[ ]*\/>/)
      summary.delete("")
      summary.map! do |row|
        row.gsub!("&quot;","")
        row.strip!
        row
      end
      if summary[1].match(/(January|February|March|April|May|June|July|August|September|October|November|December)/)
        date = process_date(summary[1])
        location = summary[0].downcase
        Abbreviation.all.each do |a|
          location.gsub!(a.orig_term, a.new_term)
        end
        location.gsub!(" - ", " ")
        new_loc = find_location(location)[:p]
        loc_s = new_loc.name unless new_loc.class == String or new_loc.nil?
        locations[loc_s] = locations[loc_s].nil? ? 1 : locations[loc_s] + 1
      else
        date = process_date(summary[0])
      end
      entry = Event.where("name = ? AND s_time = ? AND e_time = ?", e.title, date[:start], date[:end])
      if entry.empty?
        entry = Event.new
        entry.name = e.title
        entry.s_time = date[:start]
        entry.e_time = date[:end]
        entry.raw_location = location
        entry.place = find_location(location)[:p] unless find_location(location)[:p].nil?
        logger.debug as_json(entry)
        entry.save
      end
      entries.push({:title => e.title, :content => summary, :time => date, :location => location})
    end
    render json: {:count => entries.length, :locations => locations, :entries => entries}
  end





end
