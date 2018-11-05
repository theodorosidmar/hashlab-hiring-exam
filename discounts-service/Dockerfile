FROM ruby:2.5.1-alpine
WORKDIR /discounts-service
COPY Gemfile .
COPY Gemfile.lock .
RUN apk add --update build-base
RUN BUNDLE_FORCE_RUBY_PLATFORM=1 bundle install --jobs $(nproc) --without development test
COPY . .
CMD ["ruby", "app.rb"]
EXPOSE 3001