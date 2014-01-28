Campusevents::Application.routes.draw do

  get "places" => "places#index"
  get "places/search" => "places#search"
  get "events/index"
  get "events/college"
  get "events/middbeat"
  resources "events"
  root 'map#index' # shortcut for the above
end
