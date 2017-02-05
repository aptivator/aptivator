<div id = "app-1">
  <h3>Application 1</h3>
  <div class = "row">
    <div class = "col-md-5">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi rutrum, purus 
      id tristique euismod, elit lectus porttitor lacus, viverra sollicitudin neque 
      eros sit amet justo. Praesent molestie odio et scelerisque ultrices. Nunc 
      finibus aliquam erat eu placerat. Quisque lacinia rutrum erat, at semper elit 
      pulvinar et. Sed id metus venenatis, ornare tellus vitae, ornare ante. Quisque 
      id eleifend odio, et blandit nulla. Vestibulum ante ipsum primis in faucibus 
      orci luctus et ultrices posuere cubilia Curae; Nam dignissim scelerisque augue 
      sed venenatis. Praesent aliquet varius tortor ut malesuada. In massa nibh, 
      fringilla sed odio ut, auctor lacinia elit. Cras est orci, semper in lectus eu, 
      blandit sodales nisi. Pellentesque dignissim lacinia felis, sed venenatis risus 
      tristique ut.
    </div>
    <div class = "col-md-7">
      Pellentesque venenatis nec ipsum nec ornare. Nam euismod nisi vitae magna porttitor, 
      id porttitor augue pretium. In ac fermentum urna, eget tincidunt ipsum. Praesent 
      efficitur sodales orci, et vulputate lacus molestie ac. Vestibulum vel vestibulum 
      orci, eu malesuada risus. Mauris eget libero quis ante iaculis porta ut non libero. 
      Nunc eu rutrum dolor. Nunc nec cursus lacus.
    </div>
  </div>
  <h4>Resolves</h4>
  <div class = "row">
    <div class = "col-md-12">
      <% _.each(resolves, function(value, name) { %>
        <p><%= name %>: <%= value %></p>
      <% }); %>
      <p><a href = "<%= aptivator.href('app-1', 'test', 'test') %>">App-1 Link (with different parameters)</a></p>
      <p><a href = "<%= aptivator.href('app-2.form') %>">App-2 Form Link (generated from within a template)</a></p>
    </div>
  </div>
  <p><strong><%= route.fragment %> <%= route.stateName %></strong></p>
  <% if(_.keys(route.params).length) { %>
  <h4>Route params</h4>
  <div class = "row">
    <div class = "col-md-12">
      <% _.each(route.params, function(value, name) { %>
        <p><%= name %>: <%= value %></p>
      <% }); %>
    </div>
  </div>
  <% } %>
  <% if(direct) { %>
  <h4>Direct params</h4>
  <div class = "row">
    <div class = "col-md-12">
      <% direct && _.each(direct, function(value, name) { %>
        <p><%= name %>: <%= value %></p>
      <% }); %>
    </div>
  </div>
  <% } %>
</div>
