<div class = "row">
  <h2>Header</h2>
  <div class = "col-md-12">
    <ul class = "nav navbar-nav">
      <% _.each(dataParams.links, function(name, state) { %>
        <li><a href = "<%= aptivator.href(state) %>"><%= name %></a></li>
      <% }); %>
    </ul>
  </div>
</div>
