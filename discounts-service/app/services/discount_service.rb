require_relative '../lib/get_pct'

class DiscountService < Discount::GetService::Service
  # RPC Methods
  def by_birth_date(request, call)
    raise_bad_request unless request.products.length > 0
    begin
      pct = GetPct.by_birth_date(request.birth_date)
      default_response(request.products, pct)
    rescue Exception => error
      raise_unknown error
    end
  end

  private

  def default_response(products, pct)
    products = products.to_a
    products.each do |product|
      price_in_cents = product.price_in_cents
      if pct > 0
        value_in_cents = price_in_cents - (price_in_cents * (1 - pct)).to_i
        product['discount'] = Discount::Discount.new(pct: pct.round(2), value_in_cents: value_in_cents)
      else
        product['discount'] = Discount::Discount.new(pct: 0, value_in_cents: 0)
      end
    end
    Discount::DefaultResponse.new(products: products)
  end

  def raise_bad_request
    raise GRPC::BadStatus.new(GRPC::Core::StatusCodes::INVALID_ARGUMENT, "Bad request")
  end

  def raise_unknown(error)
    puts "Raising unknown exception: #{error.inspect}"
    raise GRPC::BadStatus.new(GRPC::Core::StatusCodes::UNKNOWN, "Unknown")
  end
end
