// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//

//= require jquery
//= require jquery_ujs
//= require sample
//= require react
//= require react_ujs
//= require components
//= require turbolinks
//= require_tree .

function showFlashMessage(data) {
  var msg = (data.message.shift)  ? data.message[0] : data.message;
  $('.flash').html('<div class="alert alert-' + data.result + '">' + msg + '</div');
  var delay = 60000;
  setTimeout(function() { console.log('clear flash'); $('.flash').html(''); }, delay);
}
