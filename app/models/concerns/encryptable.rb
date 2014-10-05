module Encryptable
  extend ActiveSupport::Concern

  included do

    attr_accessor :password

    def encrypted?
       !self.password_hash.nil?
    end


    def encrypt_password
      if password.present?
        self.password_salt = BCrypt::Engine.generate_salt
        self.password_hash= BCrypt::Engine.hash_secret(password, self.password_salt)
      end
    end

    def clear_password
      self.password = nil
    end

    def encrypted?
     !self.password_hash.nil?
    end

  end

end