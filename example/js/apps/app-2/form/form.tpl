<form>
  <div>
    <input name = "first-name" id = "first-name" type = "text" 
    class = "form-control" placeholder = "First name" 
    bxv-deps = "#zip-code" autocomplete = "off" bxv-required/>
  </div>
  <div>
    <input name = "last-name" type = "text" class = "form-control" 
     placeholder = "Last name" bxv-deps = "#first-name, #zip-code"
     bxv-required autocomplete = "off" />     
  </div>
  <div>
    <input id = "zip-code" name = "zip-code" type = "text" class = "form-control" 
    placeholder = "Zip code" autocomplete = "off" bxv-required />
  </div>
  <button class = "btn btn-default" bxv-deps = "{selector: 'input', silent: true, disable: true}">Send info</button>
</form>
<div class = "plus"></div>
