require 'test_helper'

class FrameControllerTest < ActionController::TestCase
  test "should get move" do
    get :move
    assert_response :success
  end

end
