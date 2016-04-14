class DashboardController < ApplicationController

  def index
    flash.clear
    @books = Book.all
  end

end