class BooksController < ApplicationController
  
  before_filter :set_current, only: [:show, :edit]
  before_action :set_book, only: [:show, :edit, :move, :hide]

  respond_to :html, :json
  
  # hack, to test response by typing URLs in browser
  layout -> (controller) { controller.request.format == 'json' ? false : 'application' }

  
  def index
      @books = Book.all.page(params[:page])
      @sort_by = 'updated_at'
      @dir = session[:books_sort_dir] || 'asc'
  end

  def move
  end

  def hide
  end

  def new
    @book = Book.new
  end

  def edit
    redirect_to action: :show
  end

  
  def create
      p params[:book].inspect
      @book = Book.new(book_params)
      if @book.save
          flash[:notice] = "#{@book.title} has been successfully created"
          set_current
      else
          flash[:error] = "Form is invalid"
      end
      redirect_to books_path
  end
  
  def show
  end
  
  def update
  end
  
  private
  
  def book_params
      params.require(:book).permit(:title, :category)
  end


  def set_book
    @book = Book.find(params[:id])
  end

  def set_current
      session[:current_node] = @book.id if @book
  end
end
