class Frame < ActiveRecord::Base

  #include UUID

   # validates :position, :parent, :content presence: true
  attr_accessor :protected_parent

  STORAGE = %w(FILE DB EXTERNAL)

  belongs_to :page, foreign_key: 'parent_id', class_name: 'Page'

  def is_encrypted?
    return false unless self.parent
    find_protected_parent
    return false unless protected_parent
  end


 private

  def encrypted_content
    return self.body unless protected_parent
  end

  def decrypted_content
    return self.body unless self.is_encrypted?
    decrypt_content
  end

  def find_protected_parent
    parent_obj = self
    while parent_obj.class.to_s != 'Book'
      parent_obj = parent_obj.parent
      return nil if !parent_obj  # orphaned node
      if parent_obj.encrypted?
        protected_parent = parent_obj
      end
    end
  end

end
