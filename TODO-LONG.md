# LONG-TERM TODOS

* Documentation
* Write a documentation note about source structure
* note that it is a good practice to know which states are serial and which are parallel at the onset and use them as such
* note that when specifying animations, the animation must be declared for specific element and not pseudo-elements
* note that when using multiple classes for animation, these classes should not override the previous class's animation or transition property
* note that best practice is for root state is to be blank and be a template placeholder for other states
* root state must have a singular view (not a template).  Within a view an el property designates the element where app will be placed
* note when activating two serial states simultaneously, the last one will be canceled
* Sprinkle comments throughout code
* Tutorial
* start exploring how to write tests
* start exploring how to rollup and bundle the frameweork for distribution
* make sure everything works well across various browsers

* when assembling parameters, consider caching some of these to optimize performance

* do not forget to put callback support for animator
* parent state that does not have a view, just resolves and data
* finalize state destruction api (can be useful when login out and wanting to clear states from memory

* what about adding routeEnums to make sure that some route values are constrained
* what about also adding routeRxs to set a regex pattern for a parameter
* think about grouping state's route configs in one object
* regarding above, make changes to fragment module's functions that use routeRx if RegExps support is added for route params
