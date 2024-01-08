Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  resources :clients do
    resources :transactions
    resources :cases do
      resources :collections
    end
  end

  get 'clients/:client_id/case_options', to: 'transactions#case_options'

  root 'clients#new'
end
