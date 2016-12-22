# TODOs

* Documentation
* Write a documentation note about source structure
* Sprinkle comments throughout code
* Tutorial
* add parallel flag on activate() to indicate other states to load parallel to the focal state
* think about whether to have a caching policy variables
* take a look to see what variables need to be moved from vars to data-stores.js
* when multiple views are in a state cache: auto could be a flag for one of the views
* think about dependency implementation among states not just views within a state
* purely perfectionist, but take a look at some views that do not need to be hidden and then displayed right away
* appropriate routeParams should be given to a respective state or view.  If stateConfigs does not include route, then no routeParams should be given. (not critical)
* defaultState should be defaultStates and an array containing a number of states that can be activated at the outset
* parent state receives its own route params
* distinguish between route error state and error state when software error occurs...
* think about using refresh tag to control if some non-cacheable ancestor states get regenerated when a child state is activated
* in ```aptivator.state()``` handle navigation to error state
* put back parallel states (if necessary)
* think through the process for handling  invalid routes include history.replace(), etc.
* put back the code to handle invalid routes
* put back the code to handle exit from error state
* handle 'pending' status when activate() is invoked
* instead of using 'pending' think about activate() returning a promise and then queueing the next activate() call
* place history object back
* add state names to transient states library?
* Think about whether parallel states are necessary
* In history object create a flexibile get() method
* Should intermediate be just a state? (that would fit into a general state mechanisms - declaration, loading, unloading) (*DEFINITELY*)
* Caching of intermediate views (thinking of this as transient states that are activated and deactivated, changes it)
* Transient state deactivation should be done automatically
* Then intermediates are just loaded and unloaded with caching or no caching... (they should be treated like states)
* animate change from state to state - make it look less sharp
* regarding the above one, place a class that makes application container invisible and then remove it after rendering
* for animation think about adding class operations performed when views are activated and inactivated
* modals/notifiers (A state that loads parallel to current state)
* route with parent route having a param
* figure out what to do with parent route having an optional param
* finalize procedures on default routeValues (these could be concatenated when state() is called)
* there are receivers that always get data, think about adding methods that simply trigger without data
* think about use cases that may need sessionStorage or localStorage
* error views within a certain state
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
