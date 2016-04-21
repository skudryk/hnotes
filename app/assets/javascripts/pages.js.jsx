var Page = React.createClass({
   getInitialState: function() {
    return {collapsed: true, indicator: '+'};
  },
  render: function() {
    var self = this;
    console.log('page:',self.props);
    var frames = self.props.frames || [];
    var subpages = self.props.pages || [];
    return (
      <div className="page-container" id={'page_' + self.props.id}>
        <div className="page-heading">
          <strong className="page-title">
            <a className="page-collapse" onClick={self.expandTree}>{self.state.indicator}</a>&nbsp;
            <a title={this.props.category} onClick={self.editPage}> {self.props.title}</a>
          </strong>
        </div>
        <div className="page-subpages pull-left">
          <PagesList data={subpages} parent_page={self} />
        </div>
        <div className="page-frames pull-left">
          <FramesList data={frames} page={this} />
        </div>
        <div className="page-edit">
           <PageForm onPageSubmit={self.props.page_set.handlePageSubmit} heading="Edit page" page={self.props} />
        </div>
      </div>
    );
  },
  expandTree: function(event) {
    $('#page_' + this.props.id + ' .page-subpages').toggle();
    this.setState({indicator: (this.state.indicator == '+') ? '-' : '+'});
    return;
  },
  editPage: function(event) {
    $('#page_' + this.props.id + ' .page-edit').toggle();
    return;
  }
});

var PagesSet = React.createClass({
  loadFramesFromServer: function() {
    $.ajax({
      url: '/pages/' + this.props.id,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handlePageSubmit: function(page) {
    console.log('PagesSet.handlePageSubmit',page);
    var pages = this.state.data;
    var method = (page.id) ? 'put' : 'post';
    var url = (page.id) ? '/pages/' + page.id : '/pages'; 
    if (!page.id) {
      pages.push(page);
    }
    this.setState({data: pages}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: url,
        dataType: 'json',
        type: method,
        data: { page: page },
        success: function(data) {
          console.log('response:',data);
          showFlashMessage(data);
        }.bind(this),
        error: function(xhr, status, err) {
          pages.pop();
          this.setState({data: pages});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: this.props.pages || []}; // pages passed directly from Book
  },
  showPageForm: function() {
    $('.new-page').toggle();
    return;
  },
  render: function() {
    // here we set 'parent' property to have ability to access own methods from child objects (Page)
    // 
    var self = this;
    return (
      <div className="pages-set">
        <PagesList data={this.state.data} book={this.props.book} page_set={this} />
        <hr />
        <div className="p20"><a onClick={this.showPageForm} >New page</a></div>
        <div className="new-page">
          <PageForm onPageSubmit={this.handlePageSubmit} />
        </div>
      </div>
    );
  }
});

var PagesList = React.createClass({
  render: function() {
    console.log('pages:',this.props);
    var self = this;
    var pages = this.props.data.map(function(page, index) {
      return (
        <Page date={page.updated_at} category={page.category} id={page.id}
              title={page.title} page_set={self.props.page_set} key={index}
              tags={page.tags} parent_id={page.parent_id} parent_page={self.props.parent_page}>
        </Page>
      );
    });
    return (<div className="pages-list">{pages} </div>);
  }
});

var PageForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var data = {};
    var attrs = ['title','category','id','tags'];
    for(var i=0; i < attrs.length; i++) {
      data[attrs[i]] = this.refs[attrs[i]].value.trim();
    }
    if (!data.title || !data.tags) { // primitive validation
      return;
    }
    this.props.onPageSubmit(data);
    if (!data.id) {
      for(var i=0; i < attrs.length; i++) {
        this.refs[attrs[i]].value = '';
      }
    }
    return;
  },
  render: function() {
    this.props.method = (this.props.page) ? 'put' : 'post';
    var page = this.props.page || {};
    return (
      <div className="panel">
        <div className="page-heading"> {this.props.heading || 'Add a Page' }</div>
        <div className="page-body">
          <form className="page-form " onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label className="control-label" forName="titleInput">Name</label>
              <input type="text" id="titleInput" className="form-control" placeholder="Name" ref="title" defaultValue={page.title} />
            </div>
            <div className="form-group">
              <label className="control-label" forName="categoryInput">Category</label>
              <input type="text" className="form-control" id="categoryInput" rows="3" placeholder="Category" ref="category" defaultValue={page.category} />
            </div>
            <div className="form-group">
              <label className="control-label" forName="page_tags">Tags</label>
              <input type="text" id="page_tags" className="form-control" placeholder="health, food" ref="tags" defaultValue={page.tags} />
            </div>
            <div className="form-group">
              <label className="control-label" forName="page_hidden">Private</label>
              <input type="checkbox" id="page_hidden" className="form-control" ref="hidden" defaultValue={page.hidden} />
            </div>
            <input type="hidden" defaultValue={page.id} ref="id" />
            <input type="submit" className="btn btn-primary btn-large" value="Save" />
          </form>
        </div>
      </div>
    );
  }
});
