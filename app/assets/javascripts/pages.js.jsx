//var converter = new Showdown.converter();

var Page = React.createClass({
  render: function() {
    //var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="page panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">
            {this.props.author}
          </h3>
        </div>
        <div className="panel-body">
          {/* <span dangerouslySetInnerHTML={{__html: rawMarkup}} /> */ }
        </div>
      </div>
    );
  }
});

var FrameBox = React.createClass({
  loadFramesFromServer: function() {
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
  handleFrameSubmit: function(frame) {
    var frames = this.state.data;
    frames.push(frame);
    this.setState({data: frames}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: { frame: frame },
        success: function(data) {
        }.bind(this),
        error: function(xhr, status, err) {
          frames.pop();
          this.setState({data: frames});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadFramesFromServer();
    //setInterval(this.loadFramesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="frameBox">
        <h1>Frames</h1>
        <FrameList data={this.state.data} />
        <FrameForm onFrameSubmit={this.handleFrameSubmit} />
      </div>
    );
  }
});

var FramesList = React.createClass({
  render: function() {
    var frameNodes = this.props.data.map(function(frame, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Frame date={frame.date} key={index}>
          {frame.text}
        </Frame>
      );
    });
    return (
      <div className="frameList">
        {frameNodes}
      </div>
    );
  }
});

var FrameForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onFrameSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return;
  },
  render: function() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">Add a Note</div>
        <div className="panel-body">
          <form className="frameForm " onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label" forName="authorInput">Author</label>
              <input type="text" id="authorInput" className="form-control" placeholder="Your name" ref="author" />
            </div>
            <div className="form-group">
              <label className="control-label" forName="frameInput">Frame</label>
              <textarea className="form-control" id="frameInput" rows="3" placeholder="Write something..." ref="text" />
            </div>
            <input type="submit" className="btn btn-primary" value="Post" />
          </form>
        </div>
      </div>
    );
  }
});

$(document).on("page:change", function() {
  var $content = $("#container pages");
  if ($content.length > 0) {
    ReactDOM.render(
      <FrameBox url="frames.json" pollInterval={2000} />, 
      document.getElementById('content') 
    ); 
  }
})
