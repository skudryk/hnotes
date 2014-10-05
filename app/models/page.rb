class Page < ActiveRecord::Base
  
  #include UUID
  include Encryptable

  has_many :pages, as: :parent, :foreign_key => 'parent_id', :class_name => 'Page',
                          :dependent => :delete_all
  belongs_to :parent, polymorphic: true, :foreign_key => 'parent_id'
  has_many :frames, foreign_key: 'parent_id'
  
  validates :title, :position, :parent_id, presence: true
  
  attr_accessor :parent_class
  
  #scope :public, -> {where (hidden: false) }
  
  def is_root_page?
     get_parent.class.to_s == 'Book'
  end
  
  def empty?
    self.pages.empty?
  end
  
  def count_subpages
    self.pages.count
  end
  
  def parent_class=(value)
    self.parent_type, self.parent_id = value.split(':')
  end
   
  def get_parent
    self.parent_type.constantize.find_by(self.parent_id) || Book.find_by(self.parent_id)
  end
  
  def suggested_parent_list
    l = []
    if self.parent_id
      p "parent: #{self.parent_id}"
      @parent = get_parent
      if @parent
        l << @parent
        # add sibling pages to the list 
        if @parent.class.to_s != 'Book' and @parent.parent
          @parent.parent.pages.map {|n| l << n}
        end
      end  
    end
    p "list: #{l}"
    l
  end
    
end
