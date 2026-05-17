Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # User authentication (JWT)
      devise_for :users,
        path: "auth",
        path_names: { sign_in: "sign_in", sign_out: "sign_out", registration: "sign_up" },
        controllers: {
          sessions: "api/v1/auth/sessions",
          registrations: "api/v1/auth/registrations"
        }

      # Admin authentication (JWT)
      devise_for :admins,
        path: "admin/auth",
        path_names: { sign_in: "sign_in", sign_out: "sign_out" },
        controllers: {
          sessions: "api/v1/auth/admin_sessions"
        }

      # Products (public read, admin write)
      resources :products, only: %i[index show]

      # Cart
      resource :cart, only: %i[show] do
        resources :cart_items, only: %i[create update destroy]
      end

      # Orders
      resources :orders, only: %i[index show create]

      # Payments (mock)
      resources :payments, only: %i[create]

      # User profile
      resource :profile, only: %i[show update]

      # Admin namespace
      namespace :admin do
        resources :products
        resources :orders, only: %i[index show update]
        resources :users, only: %i[index show]
      end
    end
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
