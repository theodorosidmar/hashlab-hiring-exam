this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'app', 'lib')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'discount_services_pb'

class DiscountServer < DiscountService::Service
  def get(user_id)
    products = []
    id = 1
    3.times do
      product = Product.new(id: id, price_in_cents: 1000, title: 'Produto', description: 'Descrição')
      product[:discount] = Discount.new(pct: 10, value_in_cents: 100)
      products << product
      id += 1
    end
    Discount::DiscountResponse.new(products)
  end
end

def main
  server = GRPC::RpcServer.new
  server.add_http2_port("#{ENV['HOST']}:#{ENV['PORT']}", :this_port_is_insecure)
  puts "Server running insecurely on #{ENV['HOST']}:#{ENV['PORT']}"
  server.handle(DiscountServer)
  server.run_till_terminated
end

main
