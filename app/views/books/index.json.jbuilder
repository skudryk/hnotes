json.array!(@books) do |book|
  json.extract! book, :title, :id, :category, :updated_at
  json.pages book.pages, :id, :title, :parent_id, :parent_type, :hidden, :tags, :category, :position, :updated_at
end
