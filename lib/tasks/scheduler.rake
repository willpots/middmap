desc "This task is called by the Heroku scheduler add-on"
task :update_feed => :environment do
  uri = URI("http://www.middmap.com/events/college.json")
  Net::HTTP.get(uri)
end