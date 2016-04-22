          
var Frame = React.createClass({
   getInitialState: function() {
    return {border: {on: '1px dashed gray', off: 'none'}, hidden: false, icon: ''};
  },
  render: function() {
    var self = this;
    return (
      <div className="frame-container" id={'frame_' + this.props.id}>
        <div className="frame-heading">
          <strong className="frame-title">
            <a title={this.props.category} onClick={self.editFrame}> {this.props.title}</a>
          </strong>
        </div>
        <div className="frame-edit">
           <FrameForm onFrameSubmit={self.props.frame_set.handleFrameSubmit} heading="Edit frame" frame={self.props} />
        </div>
      </div>
    );
  },
  editFrame: function(event) {
    $('#frame_' + this.props.id + ' .frame-edit').toggle();
    return;
  }
});

// page content
var FramesSet = React.createClass({
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
    return {data: this.props.data || []};
  },
  //componentDidMount: function() {
  //  this.loadFramesFromServer();
    //setInterval(this.loadFramesFromServer, this.props.pollInterval);
  //},
  addFrame: function() {
    //$('.modal').show();
  },
  render: function() {
    console.log('props for frameset:', this.props);
    var fsid = "frames-set-" + this.props.page.props.id;
    var sel2 = '#' + fsid + ' .modal';
    return (
      <div id={fsid}>
        <FramesList data={this.state.data} />
        <a data-toggle="modal" data-target={sel2} data-keyboard="true" onClick={self.addFrame}>Add Content</a>
        <FrameForm onFrameSubmit={this.handleFrameSubmit} />
      </div>
    );
  }
});

var FramesList = React.createClass({
  render: function() {
    var frames = this.props.data.map(function(frame, index) {
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
      <div className="frames-list">
        {frames}
      </div>
    );
  }
});

var FrameForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var data = {};
    var attrs = ['name','category','id','body','tags','position'];
    for(var i=0; i < attrs.length; i++) {
      data[attrs[i]] = this.refs[attrs[i]].value.trim();
    }
    if (!data.title || !data.tags) { // primitive validation
      return;
    }
    this.props.onFrameSubmit(data);
    if (!data.id) {
      for(var i=0; i < attrs.length; i++) {
        this.refs[attrs[i]].value = '';
      }
    }
    return;
  },
  render: function() {
    this.props.method = (this.props.frame) ? 'put' : 'post';
    var frame = this.props.frame || {};
    return (
      <div className="modal modal-dialog modal-lg fade" role="dialog" tabIndex="-1">
        <div className="modal-content">
          <div className="modal-header">
            <strong>{this.props.heading || 'New frame' } {frame.title}</strong>
            <button type="button" className="close" data-dismiss="modal">&times;</button>
          </div>
          <div className="modal-body">
            <form className="frame-form " onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="control-label" forName="frame_name">Name</label>
                <input type="text" id="frame_name" className="form-control" placeholder="Name" ref="name" defaultValue={frame.name} />
              </div>
              <div className="form-group">
                <label className="control-label" forName="frame_category">Category</label>
                <input type="text" className="form-control" id="frame_category" rows="3" placeholder="Category" ref="category" defaultValue={frame.category} />
              </div>
              <div className="form-group">
                <label className="control-label" forName="frame_tags">Tags</label>
                <input type="text" id="frame_tags" className="form-control" placeholder="health, food" ref="tags" defaultValue={frame.tags} />
              </div>
              <div className="form-group">
                <label className="control-label" forName="frame_hidden">Private</label>
                <input type="checkbox" id="frame_hidden" className="form-control" ref="hidden" defaultValue={frame.hidden} />
              </div>
              <div className="form-group">
                <label className="control-label" forName="frame_body">Content</label>
                <textarea id="frame_body" className="form-control" placeholder="Type here text" ref="body" defaultValue={frame.body} />
              </div>
              <input type="hidden" defaultValue={frame.id} ref="id" />
              <input type="submit" className="btn btn-primary btn-large" value="Save" />
            </form>
          </div>
        </div>
      </div>
    );
  }
});

