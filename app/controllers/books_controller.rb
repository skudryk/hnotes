class BooksController < ApplicationController
  
  before_filter :set_current, only: [:show, :edit]

  
  def index
      @books = Book.all.page(params[:page])
      @sort_by = 'updated_at'
      @dir = session[:books_sort_dir] || 'asc'
  end

  def move
      @book = Book.find(params[:id])
  end

  def hide
      @book = Book.find(params[:id])
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
    @book = Book.find(params[:id])
  end
  
  def update
  end
  
  private
  
  def book_params
      params.require(:book).permit(:title, :category)
  end

  def set_current
      session[:current_node] = @book.id if @book
  end
end
