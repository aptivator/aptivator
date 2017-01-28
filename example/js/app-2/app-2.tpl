<div id = "app-2">
  <h3>Application 2 <%= resolves.random1 %></h3>
  <h4>Route Params</h4>
  <ul>
    <% _.each((route || {}).params, function(value, key) { %>
      <li><%= key %>:<%= value %></li>
    <% }); %>
  </ul>
  <div class = "row">
    <div class = "col-md-12">
      <ul class = "nav navbar-nav">
        <li><a href = "<%= aptivator.href('app-1') %>">Application 1</a></li>
        <li><a href = "<%= aptivator.href('app-2.info') %>">Home</a></li>
        <li><a href = "<%= aptivator.href('app-2.form') %>">Form</a></li>
        <li><a href = "<%= aptivator.href('app-2.about') %>">About</a></li>
      </ul>
    </div>
  </div>
  <div class = "main"></div>
</div>
