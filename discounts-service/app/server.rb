require 'grpc'
require_relative 'services/discount_service'

module Discount
  class Server < GRPC::RpcServer
    def initialize(host, port)
      @host = host
      @port = port
      super()
    end

    def start
      add_http2_port("#{@host}:#{@port}", :this_port_is_insecure)
      handle(DiscountService)
      run_till_terminated
    end

    private

    def run_till_terminated
      puts "Server running insecurely on #{@host}:#{@port}"
      super
    end
  end
end
