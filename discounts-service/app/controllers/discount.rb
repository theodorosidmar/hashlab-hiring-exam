require 'discount_services_pb'

class DiscountController
  def self.get(request)
    products = request.products.to_a
    birth_date = Time.at(request.birth_date.to_i / 1000).utc
    discount = self.apply(birth_date)
    products.each do |product|
      if discount > 0
        price_in_cents = product.price_in_cents
        value_in_cents = price_in_cents - (price_in_cents * (1 - discount)).to_i
        product['discount'] = Discount::Discount.new(pct: discount, value_in_cents: value_in_cents)
      end
    end
    Discount::GetResponse.new(products: products)
  end

  private

  # Discount logic goes here
  def self.apply(birth_date)
    now = Time.now
    if birth_date.day == 29 and birth_date.month == 02
      # No discount for February 29
      0
    elsif (birth_date.day == now.day) && (birth_date.month == now.month)
      # 50% discount for his birthday
      0.50
    elsif birth_date.month == now.month
      # 20% discount for his month birthday
      0.20
    else
      # 10% discount
      0.10
    end
  end
end
