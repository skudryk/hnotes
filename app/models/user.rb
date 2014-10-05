class User < ActiveRecord::Base

   #include UUID
   include Encryptable
   include Person

end
