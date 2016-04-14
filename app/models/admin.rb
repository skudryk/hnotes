class Admin < ActiveRecord::Base

    include Person

    def have_access?(record)
        true
    end
end
