require_relative 'controllers/discount'

class DiscountServer < Discount::Service::Service
  def get(request, call)
    puts "Request received: #{request.inspect}"
    raise GRPC::BadStatus.new(GRPC::Core::StatusCodes::INVALID_ARGUMENT, "Bad request") unless
      request.products.length > 0
    begin
      DiscountController.get(request)
    rescue Exception => error
      p "Request raise Error: #{error.inspect}"
      raise GRPC::BadStatus.new(GRPC::Core::StatusCodes::UNKNOWN, "Unknown")
    end
  end
end
