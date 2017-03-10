<form id = "another-form">
  <select class = "selector form-control">
    <% _.each(resolves.selects, function(text, value) { %>
      <option value = "<%- value %>"><%= text %></option>
    <% }); %>
  </select>
</form>
