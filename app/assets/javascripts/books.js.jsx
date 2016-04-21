var Book = React.createClass({
   getInitialState: function() {
    return {collapsed: true, indicator: '+'};
  },
  render: function() {
    var self = this;
    var pages = self.props.pages || [];
    return (
      <div className="book-container" id={'book_' + this.props.id}>
        <div className="book-heading">
          <strong className="book-title">
            <a className="book-collapse" onClick={self.expandTree}>{self.state.indicator}</a>&nbsp;
            <a title={this.props.category} onClick={self.editBook}> {this.props.title}</a>
          </strong>
        </div>
        <div className="book-pages">
          <PagesSet pages={pages} book={this} />
        </div>
        <div className="book-edit">
           <BookForm onBookSubmit={self.props.parent.handleBookSubmit} caps="Edit book" book={self.props} />
        </div>
      </div>
    );
  },
  expandTree: function(event) {
    var book_id = this.props.id;
    //console.log('this',this);
    $('#book_' + book_id + ' .book-pages').toggle();
    this.setState({indicator: (this.state.indicator == '+') ? '-' : '+'});
    return;
  },
  editBook: function(event) {
    var book_id = this.props.id;
    $('#book_' + book_id + ' .book-edit').toggle();
    return;
  }
});

var BooksBox = React.createClass({
  loadBooksFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleBookSubmit: function(book) {
    console.log('BooksBox.handleBookSubmit',book);
    var books = this.state.data;
    var method = (book.id) ? 'put' : 'post';
    var url = (book.id) ? '/books/' + book.id : this.props.url; 
    if (!book.id) {
      books.push(book);
    }
    this.setState({data: books}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: url,
        dataType: 'json',
        type: method,
        data: { book: book },
        success: function(data) {
          console.log('response:',data);
          showFlashMessage(data);
        }.bind(this),
        error: function(xhr, status, err) {
          books.pop();
          this.setState({data: books});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadBooksFromServer();
    //setInterval(this.loadBooksFromServer, this.props.pollInterval);
  },
  showBookForm: function() {
    $('.new-book').toggle();
    return;
  },
  render: function() {
    // here we set parent property to have ability to access own methods from child objects
    return (
      <div className="books-box">
        <h2>Books</h2>
        <BookList data={this.state.data} parent={this} />
        <hr />
        <div className="p20"><a onClick={this.showBookForm} >New book</a></div>
        <div className="new-book">
          <BookForm onBookSubmit={this.handleBookSubmit} />
        </div>
      </div>
    );
  }
});

var BookList = React.createClass({
  render: function() {
    console.log('props:',this.props);
    var self = this;
    var books = this.props.data.map(function(book, index) {
      return (
        // `key` is a React-specific concept to recognize dynamic children items 
        <Book date={book.updated_at} category={book.category} id={book.id} pages={book.pages} title={book.title} parent={self.props.parent} key={index}>
        </Book>
      );
    });
    return (
      <div className="books-list">
        {books}
      </div>
    );
  }
});

var BookForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var data = {};
    var attrs = ['title','category','id'];
    for(var i=0; i < attrs.length; i++) {
      data[attrs[i]] = this.refs[attrs[i]].value.trim();
    }
    if (!data.title || !data.category) { // primitive validation
      return;
    }
    this.props.onBookSubmit(data);
    if (!data.id) {
      for(var i=0; i < attrs.length; i++) {
        this.refs[attrs[i]].value = '';
      }
    }
    return;
  },
  render: function() {
    this.props.method = (this.props.book) ? 'put' : 'post';
    var book = this.props.book || {};
    return (
      <div className="panel">
        <div className="book-heading"> {this.props.caps || 'Add a Book' }</div>
        <div className="book-body">
          <form className="bookForm " onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label" forName="titleInput">Name</label>
              <input type="text" id="titleInput" className="form-control" placeholder="name" ref="title" defaultValue={book.title} />
            </div>
            <div className="form-group">
              <label className="control-label" forName="categoryInput">Category</label>
              <input type="text" className="form-control" id="categoryInput" rows="3" placeholder="Category" ref="category" defaultValue={book.category} />
            </div>
            <input type="hidden" defaultValue={book.id} ref="id" />
            <input type="submit" className="btn btn-primary btn-large" value="Save" />
          </form>
        </div>
      </div>
    );
  }
});

$(document).on("page:change", function() {
  var $content = $("#container .books");
  if ($content.length > 0) {
    ReactDOM.render(
      <BooksBox url="books.json" pollInterval={3000} />, 
      $content[0] 
    ); 
  }
})
