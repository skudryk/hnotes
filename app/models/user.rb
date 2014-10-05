class User < ActiveRecord::Base

   #include UUID
   include Person
   include Encryptable

end
