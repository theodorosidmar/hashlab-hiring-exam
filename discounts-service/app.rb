this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, 'app', 'lib')
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require 'dotenv'
require 'grpc'
require 'discount_services_pb'

class DiscountServer < Discount::Service::Service
  def get(request, call)
    puts "Request received: #{request.inspect}"
    products = request.products.to_a
    products.each do |product|
      product['discount'] = Discount::Discount.new(pct: 1, value_in_cents: 10000)
    end
    Discount::GetResponse.new(products: products)
  end
end

def main
  begin
    Dotenv.load
    server = GRPC::RpcServer.new
    server.add_http2_port("#{ENV['HOST']}:#{ENV['PORT']}", :this_port_is_insecure)
    puts "Server running insecurely on #{ENV['HOST']}:#{ENV['PORT']}"
    server.handle(DiscountServer.new)
    server.run_till_terminated
  rescue SystemExit, Interrupt
    puts "Server stopped"
    server.stop
  end
end

main
