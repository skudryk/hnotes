module Person
  extend ActiveSupport::Concern

    included do

      validates :password, :confirmation => true
      validates_length_of :password, :in => 6..20, :on => :create

      before_save :encrypt_password
      after_save :clear_password

      has_many :books, as: :person

      VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
      validates :email, presence: true, :uniqueness => true, format: { with: VALID_EMAIL_REGEX }

      def have_access?(record)
          record.shared_to.include? self.id
      end

     
    end
end