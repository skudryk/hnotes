class Book < ActiveRecord::Base

  #include UUID
  include Encryptable
  
  has_many :pages, :foreign_key => 'parent_id', as: :parent, class_name: 'Page', dependent: :destroy 
  belongs_to :person, polymorphic: true
  
  #scope :public, -> {where (hidden: false) }
  
  validates :title, presence: true, :uniqueness => true
 
  
  CATEGORIES = %w(private protected read-only public)

  # NOTE: book or node can be hidden (password protected display)
 
  def count_frames
    i =0
    self.pages.map {|page| i += page.frames.count}
    return i
  end
  
  def get_people_shared_to
    []
  end

  
end
