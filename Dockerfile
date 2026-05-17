FROM ruby:3.3.7-slim

RUN apt-get update -qq && apt-get install -y \
  build-essential \
  default-mysql-client \
  default-libmysqlclient-dev \
  libyaml-dev \
  libvips \
  nodejs \
  npm \
  curl \
  git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /rails

ENV RAILS_ENV=development
ENV BUNDLE_WITHOUT=""

COPY Gemfile Gemfile.lock* ./
RUN bundle install --jobs 4

COPY . .

EXPOSE 3000

CMD ["./bin/rails", "server", "-b", "0.0.0.0"]
