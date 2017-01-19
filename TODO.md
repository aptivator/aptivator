# TODOs

* Documentation
* Write a documentation note about source structure
* Sprinkle comments throughout code
* Tutorial
* in activation initializer, clean transient state activation
* place function parameters and variable names in alphabetical order
* fix stateName comparator in preprocessor
* see if more of the lodash functions can be used
* take a look at deactivation as a process of combining appropriate activation sequences and then running through them
* finalize state deactivation api
* finalize state destruction api
* add ignorePending flag to activate() to bypass pending states
* what about adding routeEnums to make sure that some route values are constrained
* should utils be moved from api under renderer?
* put back all callbacks that ui-router supports
* put back all trigers that ui-router supports
* keep thinking about the animation object declared on the state
* start exploring how to write tests
* start exploring how to rollup and bundle the frameweork for distribution
* for error triggers and callbacks think about syntax errors and errors in resolves due to reject()
* when activating from within Backbone router, save the origin url fragment
* add back non-views to states (useful when setting up dependencies), but first implement dependencies
* it is possible for parent states using route data meant for the children, so that may need to be put back in
* make sure error states receive route object and not direct params
* think about adding callbacks triggered when state is rendered anew
* add parallel flag on activate() to indicate other states to load parallel to the focal state
* think about using refresh tag to control if some non-cacheable ancestor states get regenerated when a child state is activated
* regarding above, overlay (or rather 'weave') spec can be used to designate if part of the activationSequence is already active, then it is kept
* modals/notifiers (A state that loads parallel to current state)
* make sure that immediate views (non-main ones) are not hidden within an activationRecord
* focal flag should also apply when it comes to the removal of immediates (take a look)
* when integrating actionify, apply it and reapply it to newly instantiated views (obviously)
* **DONE** add() function in history() should not be available to users of framework
* **DONE** Should root state be declared just like any other state with parallel states, resolves, etc. (yes, with some exceptions - no parallel states, etc.)
* **DONE** simplify variable declarations in renderer()
* **DONE** test transiet states that consist of multiple views that go to different root regions (works very well)
* **DONE** views declaration in a state could be an array, if multiple views with the same address are used
* **DONE** or better, let hash in views {} to be either an altName or address.  If address is specified in the configs, then hash is altName
* **DONE** for above, when specifying dependencies among views with the same address, altName property should be used (see above)
* **DONE** Get rid of using regions, simply use selector as part of the view address (e.g., '.main@auth')
* **DONE** For the multiple allow multiple views to have the same view address
* **DONE** parentRegion should be parentSelector
* **DONE** iron out all the edge use cases involving multiples and transient and error states 
  (multiples are gone and instead many views can go into the same parent space)
* **DONE** should main flag be explicitly specified now for a view, or if a view address is '', then it means that it is a main view 
  (If view is one, then it is main, otherwise a main flag has to be used)
* **DONE** Get rid of multiple - it really has no use (states can be combined and that new state is then accessed)
* **DONE** it is possible for parallel states to share views, so change duplicate error checking in preprocessor
* **DONE** in preprocessor, when checking for duplicate views, pass the duplicate if the view objects are the same (this will help with overlapping parallel states)
* **DONE** Transient state deactivation should be done automatically (duh, it is activated automatically and should be deactivated samely)
* **DONE** animate change from state to state - make it look less sharp (possible just by assigning a class to a state's view)
* **DONE** regarding the above one, place a class that makes application container invisible and then remove it after rendering (root $els are hidden, then displayed)
* **DONE** for animation think about adding class operations performed when views are activated and inactivated
* **DONE** for animation spec also provide a way to define a selector to which the animation class is applied (no need, keeping it simple at this time)
* **DONE** for animation, a class to add at the activation of a state
* **DONE** this also affects transient states, the animation on state change should run after the transient state is removed
* **DONE** also, transients are states, should that animation be applied to them also? (sure, these could be animated also)
* **DONE** whether animation is applied can be defined by animation object on a given state (no, keeping it simple at this time, just class assignments)
* **DONE** when rendering, hide root views using hide-class and then remove the class the state is rendered
* **DONE** regarding above, this is how animations can be added without any special api
* **DONE** activationSequence should be an array to allow for multiple views per region (two different views can have the same address)
* **DONE** do not show runtime for transient states
* **DONE** in activation, move history code before resolves, in case resolve fails and the state is still vailable on the history stack
* **DONE** distinguish between route error state and error state when software error occurs... (when error occurs in aptivator, it goes to console;
  when an error occurs in developer code, then they can communicate it to the user via their own-created states)
* **DONE** handle 'pending' status when activate() is invoked (Some states may need be loaded while other states are still running)
* **DONE** instead of using 'pending' think about activate() returning a promise and then queueing the next activate() call
* **DONE** defaultState should be defaultStates and an array containing a number of states that can be activated at the outset (No, activate() should be used by a developer)
* **DONE** put back parallel states (if necessary) (these were put back)
* **DONE** Think about whether parallel states are necessary (why not, low cost and it allows for state composition)
* **DONE** put back the code to handle exit from error state (supported by framework internally; error states are in history and are deactivated automatically)
* **DONE** when multiple views are in a state cache: auto could be a flag for one of the views (caching is on a view by view basis)
* **DONE** take a look to see what variables need to be moved from vars to data-stores.js (moved activationSequences to vars.states)
* **DONE** address setting when 'main' region is designated as main holder
* **DONE** prevent more than one main view
* **DONE** assure that main view for a state has a state's parent in view's address
* **DONE** add state names to transient states library? (transient states are stores in the same registry, their names go under transient array)
* **DONE** In history object create a flexibile get() method
* **DONE** place history object back
* **DONE** Should intermediate be just a state? (that would fit into a general state mechanisms - declaration, loading, unloading) (*DEFINITELY*)
* **DONE** Then intermediates are just loaded and unloaded with caching or no caching... (they should be treated like states)
* **DONE** Caching of intermediate views (thinking of this as transient states that are activated and deactivated, changes it)
* **DONE** purely perfectionist, but take a look at some views that do not need to be hidden and then displayed right away (maybe later)
* **DONE** think about dependency implementation among states not just views within a state (not quite, states may be deactivated and dependencies would need reactivation)
* **DONE** in ```aptivator.state()``` handle navigation to error state
* **DONE** put back the code to handle invalid routes
* **DONE** when deactivating a state use both activationSequence and activationRecord (not quiet, activationRecord plus new viewsRegistry for each stateConfigs)
* **DONE** think about whether to have a caching policy variables (for now caching is done on a state-by-state basis)
* **DONE** objectify related variables (e.g., route variables [routeParts, route, routeRx, routeValues]) (not now)
* **DONE** for invalid url, activate an error state, but there is no need to replace the url with error url (let the invalid url remain)
* **DONE** think through the process for handling invalid routes include history.replace(), etc.
* **DONE** split utils api module into submodules
* **DONE** there are receivers that always get data, think about adding methods that simply trigger without data (no need for now)
* **DONE** error views within a certain state (views or states)
* **DONE** enforce that no state name is named root
* **DONE** think about use cases that may need sessionStorage or localStorage (those are available, it's up to the user)
* **DONE** assure that abstract states cannot be reached directly
* **DONE** appropriate routeParams should be given to a respective state or view.  If stateConfigs does not include route, then no routeParams should be given. (not critical)
* **DONE** make error messages clearer throughout the code
* **DONE** update errors in promises
* **DONE** some functions error out while in promise, see if that can be addressed
* **DONE** regarding above, see if aptivator.error() general function may be useful (no need, try/catch should suffice)
* **DONE** replace hasAt variable code with utils.hasAt() function (no need, includes('@') works well)
* **DONE** for error messages, provide an option to specify a module name from where the error is being generated
* **DONE** assure that named params are unique in the route
* **DONE** avoid parsing an entire child route when parent params are already parsed
* **DONE** figure out what to do with parent route having an optional param
* **DONE** regarding above, route values should be added into a url fragment from last to first (no need for that)
* **DONE** fix route.params.assemble() to use results of route.params.parse() rather than using regexes again (No need, part of route is not a param, so regexes are necessary)
* **DONE** make sure that splat parsing is on point (splat should be listed last)
* **DONE** for now, enforce required parameters being listed first and optional after that
* **DONE** parent state receives only its own route params (and its own url fragment)
* **DONE** finalize procedures on default routeValues (these could be concatenated when state() is called)
* **DONE** route with parent route having a param
* **DONE** generate truly unique view addresses
* **DONE** add a flag that sets how hidden views are handled (hidden or detached) (added detachHidden flag)
* **DONE** resolves policy should have persist and store flags
* **DONE** figure out variable naming conventions
* **DONE** figure out function naming conventions
* **DONE** ability to exclude resolve value from params; this allows resolves to be used as initializers (via store flag)
* **DONE** some resolves need to run but do not need to return value (this will influence caching) (handled via store flag)
* **DONE** ~~route/state mappings (?)~~ (put on the backburner)
* **DONE** change underscore to lodash
* **DONE** move history from libs to api (moved it into utils)
* **DONE** change libs to lib
* **DONE** move storage from lib to api (moved it under utils)
* **DONE** fix resolves order data structures and processing
* **DONE** in preprocessor make sure that each state is processed once
* **DONE** clean up preprocessor() some more (preprocessor was completely rewritten)
* **DONE** make addressing scheme implementation clearer (eliminated addresser.full and moved it to preprocessor module)
* **DONE** expand error messaging procedures (callbacks are used instead of error.throw())
* **DONE** Rewrite address module in the core (addresser.full() was moved as part of the preprocessor code)
* **DONE** Polish state loading
* **DONE** remember which substate was active when switching to a completely new state (subsumed within activationRecords system)
* **DONE** Store instance of a first-level states (a state that goes into root) (no need for that)
* **DONE** Make loading and regular state activation happen using one function (required rethinking the core)
* **DONE** state holding multiple children at a time (done via multiple flag)
* **DONE** should regular if/else be used instead of ||/&& idioms? (Yes, probably, to make the code more readable)
* **DONE** historySize should be declared for root state (not in vars), because it is changeable
* **DONE** reconcile stateResolves and viewResolves processors into one processor
* **DONE** directParams can be submitted or not, which may affect caching.  If the view is cached (without directParams), and then directParams are 
  submitted, then view has to be rerendered anew and the old instance should be destroyed (caching policy handles that)
* **DONE** when instance is destroyed, make sure that cached array gets updated (cached array was deleted)
* **DONE** the api for multiple view regions could be flag multiple which specifies array of regions that can hold multiple views
* **DONE** for multiple view regions flag prepend could be used (No need.  Ordering of elements can be done via CSS)
* **DONE** Change route references to url (*no need*)
* **DONE** Move caching policy code within waterfall() (It is now a part of renderer)
* **DONE** Caching of variable views (will work if view instance provides a receiver method for variable data)
* **DONE** Region usually contains one view, but think about it containing several (added *multiple* flag to designate regions that have multiple views)
* **DONE** Reconcile statesCache (changed the entire rendering process)
* **DONE** Think about completely eliminating Backbone.Router usage (Backbone.router works fine, no need to replace it)
* **DONE** Now, if the parent is not cached, then its children even if explicitly set to cache - will not, (*changed* the children will cache)
* **DONE** if the parent view instance is destroyed should its children be destroyed as well? (For now, yes!)
* **DONE** Restructure the router back into modules (will make it easier to work on parts of the framework)
* **DONE** Think about removing vars folder and instead use apptivator.m modules for storage (redesigned in other ways)
* **DONE** look into view destroying
* **DONE** persistence of resolves should influence caching of states (looking at parameters that come to a view allows for that)
* **DONE** ~~template assignment (?)~~ (not needed at this time)
* **DONE** Simplify _go and go() methods (these were complete rewritten and eliminated)
* **DONE** caching states based on parameters as a hash (instead parameters are deep cloned and then compared to the next batch of parameters)
* **DONE** think about removing regex declarations from vars
* **DONE** onResolveSuccess() onResolveError() callbacks (?) (*easy to put in when the need for them will arise*)
* **DONE** Some resolves (such as authorized) should also be run for cached states *addressed via persistence of resolves*
* **DONE** persistence of resolves
* **DONE** should all resolves be persistent by default?
* **DONE** persistent: false flag
* **DONE** actually, set a flag on a root state to indicate whether persist or not (persistResolves: true)
* **DONE** create a cascade-like mechanism to determine whether resolves should persist
* **DONE** remove route object in vars
* **DONE** Remove special rootState configuration object in vars.  Use states.registry instead.
* **DONE** Loading and unloading states
* **DONE** States without route param are silent by default
* **DONE** update build script to exclude core libraries (e.g., jquery)
* **DONE** use native methods when appropriate (e.g., arr.filter() vs _.filter()) (*If it is not broken, don't fix it*)
* **DONE** ~~uiRouter.next()~~ (wait for appropriate use cases)
* **DONE** ~~Altering sequences of state activation~~ (not necessary for now)
* **DONE** Look to see if _.reduce() could be used on some collections
* **DONE** ~~integrate in UI data validator into the router~~ (validator was spun as its own repo)
* **DONE** ~~allow defining validation configuration on each state~~ (validify has been taken out as its own module)
* **DONE** Make sure there are no memory leaks in connection with intra-state dependencies
* **DONE** add abstract states
* **DONE** view caching policy
* **DONE** think about hiding states and then displaying them without re-rendering
* **DONE** view caching process
* **DONE** allow router to instantiate all types of constructors (only Views should be visible)
* **DONE** ~~pushState for #-less urls~~ (on the backburner for now)
* **DONE** Introduce finer control and flexibility when setting intra-state dependencies
* **DONE** Add splats (/route/download*)
* **DONE** replace .then(resolver, rejecter) with .then(resolver).catch(rejecter)
* **DONE** communication among state views
* **DONE** dependencies for a state are specified as they appear in the views object
* **DONE** redesign data arangement used for inter-view message passing
* **DONE** add promise support for interview dependencies
* **DONE** ~~within-state intermediate views for when dependency views return a promise~~ (not needed)
* **DONE** intermediate views
* **DONE** intermediate views delays
* **DONE** Ability to define intermediate views on each state
* **DONE** Passing data parameters to intermediate views
* **DONE** uiRouter.href() to convert state name to url
* **DONE** uiRouter.isRelated(state, hash) to check if state and hash are related
* **DONE** parsing and passing of route params
* **DONE** clean Backbone route params of all the null values
* **DONE** override serializeData() method to provide reference to uiRouter within templates
* **DONE** invalid route redirection
* **DONE** Add package.json ~~and bower.json~~
* **DONE** Add states/urls cache
* **DONE** use coherent and consistent naming throughout the framework
* **DONE** replace stateName with state
* **DONE** replace viewAddress with address
* **DONE** replace currentParams with params(), etc.
* **DONE** providing current route and state information to resolves
* **DONE** triggering other states in parallel
* **DONE** parallel states and resolves
* **DONE** modify slightly the api for the parallel states to use an array
* **DONE** es6 version
* **DONE** for route params provide an object with param names and values and current route info
* **DONE** include stateName in route params
* **DONE** Can't use back button after incorrect route is requested
* **DONE** Find proper use case for the .load() method (should be handled by parallel states)
* **DONE** defaultParams for states
* **DONE** state to state data passing
* **DONE** state to state switching without urls (add silent flag to uiRouter.go())
