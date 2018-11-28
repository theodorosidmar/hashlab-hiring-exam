FROM ruby:2.5.3-alpine3.8

ENV WORKDIR /discounts-service

WORKDIR ${WORKDIR}

COPY Gemfile ${WORKDIR}
COPY Gemfile.lock ${WORKDIR}

RUN apk add --update build-base
RUN BUNDLE_FORCE_RUBY_PLATFORM=1 bundle install --jobs 2 --without development test

COPY . ${WORKDIR}

CMD ["ruby", "app.rb"]

EXPOSE 4602