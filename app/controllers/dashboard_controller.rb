class DashboardController < ApplicationController

 def index
   flash[:notice] = ''
   flash[:error] = ''
   flash[:warning] = ''
   @books = Book.all
 end

end