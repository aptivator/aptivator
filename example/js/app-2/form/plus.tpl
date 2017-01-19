<p>
  Extra text below the form <strong><%= resolves.random %></strong>
</p>
<ul>
  <% _.each(resolves, function(resolveValue, resolveName) { %>
    <li><strong><%= resolveName %></strong>: <%= resolveValue %></li>
  <% }); %>
</ul>
