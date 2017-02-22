# LONG-TERM TODOS

* Documentation
* Write a documentation note about source structure
* note that it is a good practice to know which states are serial and which are parallel at the onset and use them as such
* note that when specifying animations, the animation must be declared for specific element and not pseudo-elements
* note that when using multiple classes for animation, these classes should not override the previous class's animation or transition property
* Sprinkle comments throughout code
* Tutorial
* allow to use a template property on the state instead of a view to tell framework to create a view
* when integrating actionify, apply it and reapply it to newly instantiated views (obviously)
* start exploring how to write tests
* start exploring how to rollup and bundle the frameweork for distribution
* add back non-views to states (useful when setting up dependencies), but first implement dependencies
* think through state composition.  If a state needs route params and it is composed with another state under a new url, then what?
* figure out direct parameters for combined states
* regarding above, would it be better to use mongodb-like queries
* put back dependencies support
* if there are possible partial view deactivations, should and how should the animations be specified for the use case
* when assembling parameters, consider caching some of these to optimize performance
* do not forget to put callback support for animator
