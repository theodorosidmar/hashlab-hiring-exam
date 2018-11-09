this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'app', 'lib')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'dotenv'
require 'grpc'
require 'discount_services_pb'

class DiscountServer < Discount::Service::Service
  def get(request, call)
    puts "Request received: #{request.inspect}"
    raise GRPC::BadStatus.new(GRPC::Core::StatusCodes::INVALID_ARGUMENT, "Bad request") unless
      request.birth_date > 0 and
      request.products.length > 0
    begin
      now = Time.now
      products = request.products.to_a
      birth_date = Time.at(request.birth_date.to_i / 1000)
      discount = 0
      if birth_date.day == 29 and birth_date.month == 02
        # No discount for February 29
        return Discount::GetResponse.new(products: products)
      elsif (birth_date.day == now.day) && (birth_date.month == now.month)
        # 50% discount for his birthday
        discount = 0.50
      elsif birth_date.month == now.month
        # 20% discount for his month birthday
        discount = 0.20
      end
      if discount > 0
        products.each do |product|
          price_in_cents = product.price_in_cents
          value_in_cents = price_in_cents - (price_in_cents * (1 - discount)).to_i
          product['discount'] = Discount::Discount.new(pct: discount, value_in_cents: value_in_cents)
        end
      end
      Discount::GetResponse.new(products: products)
    rescue Exception => error
      p "Error: #{error.inspect}"
      raise GRPC::BadStatus.new(GRPC::Core::StatusCodes::UNKNOWN, "Unknown")
    end
  end
end

def main
  begin
    Dotenv.load
    server = GRPC::RpcServer.new
    server.add_http2_port("#{ENV['HOST']}:#{ENV['PORT']}", :this_port_is_insecure)
    puts "Server running insecurely on #{ENV['HOST']}:#{ENV['PORT']}"
    server.handle(DiscountServer)
    server.run_till_terminated
  rescue SystemExit, Interrupt
    puts "Server stopped"
    server.stop
  end
end

main
