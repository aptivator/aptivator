<p>
  Extra text below the form <strong><%= resolveParams.random %></strong>
</p>
<ul>
  <% _.each(resolveParams, function(resolveValue, resolveName) { %>
    <li><strong><%= resolveName %></strong>: <%= resolveValue %></li>
  <% }); %>
</ul>
