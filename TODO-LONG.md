# LONG-TERM TODOS

* Documentation
* Write a documentation note about source structure
* note that it is a good practice to know which states are serial and which are parallel at the onset and use them as such
* note that when specifying animations, the animation must be declared for specific element and not pseudo-elements
* Sprinkle comments throughout code
* Tutorial
* allow to use a template property on the state instead of a view to tell framework to create a view
* when integrating actionify, apply it and reapply it to newly instantiated views (obviously)
* start exploring how to write tests
* start exploring how to rollup and bundle the frameweork for distribution
* add back non-views to states (useful when setting up dependencies), but first implement dependencies
* think through state composition.  If a state needs route params and it is composed with another state under a new url, then what?
* figure out direct parameters for combined states
* for history, think about creating shortcut methods such as activeState, pendingTransients, etc.
* regarding above, would it be better to use mongodb-like queries
* put back dependencies support
* think about sub-states
* do I need a utilities library with methods such as hasAt()
* place canceler inside each activation step - this places its execution on the same tick as the module
* think about when an error should be thrown or when a warning should be displayed
* be on the lookout to use constructors (if appropriate)
* change hook names back to originals (e.g., start instead of started)
* should there be a cascade for animation specifications (yes)
* if there are possible partial view deactivations, should and how should the animations be specified for the use case
* should root state be instantiated and handled just like any other state and has the same settings (e.g., multiple views)
* revisit an issue again of the root state
