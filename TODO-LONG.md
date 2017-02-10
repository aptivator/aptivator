# LONG-TERM TODOS

* Documentation
* Write a documentation note about source structure
* note that it is a good practice to know which states are serial and which are parallel at the onset and use them as such
* Sprinkle comments throughout code
* Tutorial
* allow to use a template property on the state instead of a view to tell framework to create a view
* deactivate() function, defined on a state, that controls how a state is deactivated
* when integrating actionify, apply it and reapply it to newly instantiated views (obviously)
* start exploring how to write tests
* start exploring how to rollup and bundle the frameweork for distribution
* add back non-views to states (useful when setting up dependencies), but first implement dependencies
* think through state composition.  If a state needs route params and it is composed with another state under a new url, then what?
* figure out direct parameters for combined states
* for history, think about creating shortcut methods such as activeState, pendingTransients, etc.
* put back dependencies support
* think about sub-states
* do I need a utilities library with methods such as hasAt()
* place canceler inside each activation step - this places its execution on the same tick as the module
