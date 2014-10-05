# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

book_data = [
    ['Book1', false],
    ['Book2', false],
    ['Book3', true]
]
book_data.each do |title, hidden|
 Book.find_or_create_by!(title: title, hidden: hidden)
end

Page.find_or_create_by!(title: 'Page1', parent_id: Book.all.first.id, parent_type: 'Book')
Page.find_or_create_by!(title: 'Page2', parent_id: Book.all[1].id, parent_type: 'Book')
Page.find_or_create_by!(title: 'Page3', parent_id: 1)
User.create!(username: 'skudryk', fullname: 'Serhiy Kudryk', email: 'kudryk@linux.at', active: true, password: 'zxcdsaqwe')