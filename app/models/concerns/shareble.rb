module Shareble

  extend ActiveSupport::Concern

  included do

    attr_accessor :provider

    def share(resource,person)
    end


    def check_sharing(resource)
    end

    def unshare(person)
    end


  end

end