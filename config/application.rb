require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"

Bundler.require(*Rails.groups)

module EcTest
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
    config.i18n.default_locale = :ja

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins ENV.fetch("CORS_ORIGINS", "http://localhost:5173").split(",")
        resource "*",
          headers: :any,
          methods: %i[get post put patch delete options head],
          expose: %w[Authorization],
          credentials: false
      end
    end
  end
end
