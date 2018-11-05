this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'app', 'lib')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'grpc'
require 'discount_services_pb'

class DiscountServer < Discount::Service::Service
  def get(request, call)
    products = []
    i = 1
    2.times do
      product = Discount::Product.new(id: i.to_s)
      discount = Discount::Discount.new(pct: 1, value_in_cents: 500)
      product['discount'] = discount
      products << product
      i += 1
    end
    Discount::GetResponse.new(products: products)
  end
end

def main
  begin
    server = GRPC::RpcServer.new
    server.add_http2_port("#{ENV['HOST']}:#{ENV['PORT']}", :this_port_is_insecure)
    puts "Server running insecurely on #{ENV['HOST']}:#{ENV['PORT']}"
    server.handle(DiscountServer.new)
    server.run_till_terminated
  rescue SystemExit, Interrupt, abort
    puts "Server stopped"
    server.stop
  end
end

main
