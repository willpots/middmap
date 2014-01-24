Campusevents::Application.routes.draw do

  get "events/index"
  resources "events"
  root 'map#index' # shortcut for the above
end
