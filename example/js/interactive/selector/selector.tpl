<form id = "some-form">
  <input type = "text" id = "keyup" autocomplete = "off" class = "form-control" />
  <select id = "selector" class = "form-control">
    <% _.each(data.selects, function(text, value) { %>
      <option value = "<%- value %>"><%= text %></option>
    <% }); %>
  </select>
</form>
