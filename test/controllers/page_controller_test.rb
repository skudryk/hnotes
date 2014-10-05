require 'test_helper'

class PageControllerTest < ActionController::TestCase
  test "should get open" do
    get :open
    assert_response :success
  end

  test "should get move" do
    get :move
    assert_response :success
  end

  test "should get hide" do
    get :hide
    assert_response :success
  end

end
