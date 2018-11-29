require_relative 'app/server'

class Application
  class << self
    def start
      begin
        server = Discount::Server.new(ENV['HOST'], ENV['PORT'])
        server.start
      rescue SystemExit, Interrupt
        puts "Server exited/interrupted"
        server.stop
      rescue Exception => error
        puts "Stopping server. Unknown exception: #{error.inspect}"
        server.stop
      end
    end
  end
end
