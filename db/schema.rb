# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140914152829) do

  create_table "activity_logs", force: true do |t|
    t.string   "action"
    t.string   "path"
    t.string   "who"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "admins", force: true do |t|
    t.string   "email"
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "books", force: true do |t|
    t.string   "title"
    t.string   "category",      default: "public"
    t.boolean  "hidden",        default: false
    t.string   "shared_to",     default: ""
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "frames", force: true do |t|
    t.integer  "parent_id"
    t.string   "name"
    t.string   "category"
    t.integer  "position"
    t.text     "body"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "hidden",     default: false
    t.text     "content"
    t.integer  "coord_x"
    t.integer  "coord_y"
    t.string   "tags"
  end

  add_index "frames", ["tags", "content", "category"], name: "index_frames_on_tags_and_content_and_category"

  create_table "pages", force: true do |t|
    t.string   "title"
    t.string   "position",      default: "top"
    t.integer  "parent_id"
    t.string   "parent_type",   default: "Page"
    t.string   "shared_to"
    t.boolean  "hidden",        default: false
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "category",      default: "html"
    t.string   "tags"
  end

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "email"
    t.string   "fullname"
    t.boolean  "active"
    t.string   "password_hash"
    t.string   "password_salt"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "visitors", force: true do |t|
    t.string   "username"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
