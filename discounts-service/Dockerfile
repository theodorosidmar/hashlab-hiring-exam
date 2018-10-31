FROM grpc/ruby:0.11-onbuild
WORKDIR /discounts-service
COPY Gemfile .
COPY Gemfile.lock .
RUN bundle config --global frozen 1
RUN bundle install --without development test
COPY . .
CMD ["ruby", "app.rb"]
EXPOSE 3001