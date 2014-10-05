module UUID
    extend ActiveSupport::Concern
        
    #bad idea?
    included do
            # old rails versions 
            set_primary_key 'uuid'
            # later rails versions, untested:
            # self.primary_key = 'the_name'
            
            before_create :generate_uuid
            
            def generate_uuid
                self.id = SecureRandom.uuid #UUIDTools::UUID.random_create.to_s
            end
    end
end