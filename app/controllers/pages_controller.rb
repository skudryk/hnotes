class PagesController < ApplicationController
    
  def index
      @pages = Page.all.page(params[:page])
      @sort_by =  session[:pages_sort_by] || 'updated_at'
      @dir = session[:pages_sort_dir] || 'asc'
  end

  def move
      @page = Page.find(params[:id])
  end

  def hide
      @page = Page.find(params[:id])
  end

  def new
    if Book.count == 0  #TODO: add scoping
       flash[:error] = "Please create book first"
       redirect_to books_path
    end
    @page = Page.new
    @page.parent_id = session[:current_page]
    
  end

  def edit
      @page = Page.find(params[:id])
  end

  
  def create
      @page = Page.new(page_params)
      if @page.save
          flash[:notice] = "#{@page.title} has been successfully created"
      else
          flash[:error] = "Form is invalid"
      end
      redirect_to pages_path
  end
  
  def show
      @page = Page.find(params[:id])
  end
  
  def update
      @page = Page.find(params[:id])
      @page.update_attributes(page_params)
  end
  
  private
  
  def page_params
      params.require(:page).permit(:title, :position, :parent_class, :hidden)
  end

end
