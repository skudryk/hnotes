var Book = React.createClass({
  render: function() {
    return (
      <div className="book">
        <div className="book-heading">
          <h3 className="book-title">{this.props.title}</h3>
        </div>
        <div className="book-pages">
          category: <span className="book-title">{this.props.category}</span>
        </div>
      </div>
    );
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
    var books = this.state.data;
    books.push(book);
    this.setState({data: books}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: { book: book },
        success: function(data) {
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
  render: function() {
    return (
      <div className="bookBox">
        <h2>Books</h2>
        <BookList data={this.state.data} />
        <hr />
        <BookForm onBookSubmit={this.handleBookSubmit} />
      </div>
    );
  }
});

var BookList = React.createClass({
  render: function() {
    console.log('props:',this.props);
    var books = this.props.data.map(function(book, index) {
      return (
        // `key` is a React-specific concept to recognize dynamic children items 
        <Book date={book.updated_at} category={book.category} title={book.title} name={book.name} key={index}>
          {book.pages_list}
        </Book>
      );
    });
    return (
      <div className="book-list">
        {books}
      </div>
    );
  }
});

var BookForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.title.getDOMNode().value.trim();
    var category = this.refs.category.getDOMNode().value.trim();
    if (!title || !category) {
      return;
    }
    this.props.onBookSubmit({title: title, category: category});
    this.refs.title.getDOMNode().value = '';
    this.refs.category.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      <div className="panel">
        <div className="book-heading">Add a Book</div>
        <div className="book-body">
          <form className="bookForm " onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label" forName="titleInput">Name</label>
              <input type="text" id="titleInput" className="form-control" placeholder="name" ref="title" />
            </div>
            <div className="form-group">
              <label className="control-label" forName="categoryInput">Category</label>
              <input type="text" className="form-control" id="categoryInput" rows="3" placeholder="Category" ref="category" />
            </div>
            <input type="submit" className="btn btn-primary" value="Create" />
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
