Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  resources :clients do
    resources :transactions do
      member do
        get 'case_options', to: 'transactions#case_options'
      end
    end
    resources :cases do
      resources :collections
    end
  end

  root 'clients#new'
end
