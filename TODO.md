# TODOs

* cap deactivate() invocations within aptivator with .catch(_.noop)
* in animator, allow overriding animation settings if there are no other ancestors between the state and the overridden ancestor
* take a look at preprocessor code for root state and optimize
* optimize deactivation module
* refactor start module
* **DONE** fix a situation when a parent is destroyed and its children are not detached (detach should work even for hidden views)
* **DONE** add resolves duration support (allows for no persistance via duration: 0, or full persistance via duration: Infinity, and somewhere in between)
* **DONE** think about splitting renderer into two manageable parts (completely rewritten)
* **DONE** regarding above, would it be better to use mongodb-like queries (postpone for now, it is a good side project though)
* **DONE** figure out directory and file conventions (should I use libs or full directory names, or should there be an apps directory)
* **DONE** break on() into two parts: unwinding object module and callback registration module
* **DONE** for deactivation, handle simultaneous deactivation invocations
* **DONE** augment events module to allow multiple once registrations for the same handle before triggering and clearing them out
* **DONE** analyze canceled flag setting within deactivation module
* **DONE** if there are possible partial view deactivations, should and how should the animations be specified for the use case
* **DONE** in light of animation support, figure out how to handle deactivation of states
* **DONE** rethink complete through the process of deactivation (e.g., state activated fully, then only a part of it is deactivated, etc)
* **DONE** figure out how to give hooks variables to each ancestor view (hook values are given to the state that is being activated)
* **DONE** after rendering, the hooks should not affect activation timing
* **DONE** exit and error hooks should not affect deactivation timing
* **DONE** restructure and streamline errorer module
* **DONE** be on the lookout to use constructors (if appropriate)
* **DONE** what about allowing for duplicate views if they originate within different states? (duplicates are now allowed, developer will decide if appropriate)
* **DONE** simplify view property names in preprocessor
* **DONE** when declaring individual views, they should not be named elements or base
* **DONE** for animation, remove code that sets remove to false if add and remove are both true (this is implicitly handled by existing conditionals)
* **DONE** think about when an error should be thrown or when a warning should be displayed
* **DONE** think about sub-states (added; however, state definitions can be big and should be split up)
* **DONE** do I need a utilities library with methods such as hasAt() (so far no need)
* **DONE** for history, think about creating shortcut methods such as activeState, pendingTransients, etc. (for now write out full queries)
* **DONE** add on property to state definition for events registrations (for a specific state)
* **DONE** for events, flatten object event declaration by eliminating sub property
* **DONE** place function parameters and variable names in alphabetical order (parameters are placed in the order of importance and relatedness)
* **DONE** what about adding keyword this or self to views or animation definitions (it could work well)
* **DONE** for deactivation, when unique address is submitted, see if it is associated with a state, and if yes, deactivate the state
* **DONE** split displayer in lib into modules that would go under renderer and deactivation
* **DONE** add elements animation support for individual views
* **DONE** should root state be instantiated and handled just like any other state and has the same settings (e.g., multiple views)
* **DONE** revisit an issue again of the root state (root state, as a ui part, is a constant template)
* **DONE** place canceler inside each activation step - this places its execution on the same tick as the module
* **DONE** when reintegrating canceler assure that no unhandled errors are displayed (done by placing canceler outsider of promise body)
* **DONE** when a view is deleted make sure that parameters used to determine its caching status are erased also (no need because instance is set to null)
* **DONE** in rendered, remove aptivator.destroy(), invoke destroy() directly on a view instance
* **DONE** change hook names back to originals (e.g., start instead of started)
* **DONE** should there be a cascade for animation specifications (yes)
* **DONE** for above, similar approach to deactivator (i.e., destroy full, focal, and forward) (focal does not seem to be necessary)
* **DONE** for view animate declarations, allow animate: false to prevent any type of animation on the view (using null instead of false)
* **DONE** in declaring animations, if add and remove are defined, go with add
* **DONE** in animation, use base instead of self to set state's common classes
* **DONE** to complete animation, make sure that multiple view states and composites states are handled correctly
* **DONE** keep thinking about the animation object declared on the state (yes, animate object as a collection of stateNames and animationClasses)
* **DONE** animation definitvely needs to be done in displayer in case multiple states are jointly launched and share animation specs
* **DONE** animations that should affect state activation timing
* **DONE** for animation, allow selectors paired with the state name for finer animation assignment
* **DONE** for animation, make sure that both animations and transitions are handled
* **DONE** for animation, make sure that state activation continues only after the last css animation/transition is finished
* **DONE** deactivate() function, defined on a state, that controls how a state is deactivated (don't see the need)
* **DONE** move uniq address generator into some centralized module
* **DONE** trim class and event names before splitting them 
* **DONE** complete .off() to handle callbacks and contexts (needed full functionality for once() method)
* **DONE** add .once() method to execute callbacks only once
* **DONE** polish out deactivator to do broader deactivation when deactivating a state fully
* **DONE** what about directives to tell to bypass state event hooks (e.g., noHooks: true) (wait for a proper use-case)
* **DONE** noHooks spec can also be more granular (e.g., noHooks for state-change or state-exit) (wait for a proper use-case)
* **DONE** under stateConfigs combine view-related properties in one object (if it is not broke, don't fix it)
* **DONE** main view assertion should be done if a state has children, otherwise it is not necessary (not quite, main view is used to associate unique address to a state)
* **DONE** see if more of the lodash functions can be used - read lodash documentation
* **DONE** polish canceler a bit
* **DONE** change flags and event hooks to adjectives (e.g., started instead of start)
* **DONE** change order of activation(), put loading hook right before deactivator()
* **DONE** regarding above, overlay (or rather 'weave') spec can be used to designate if part of the activationSequence is already active, then it is kept
* **DONE** modals/notifiers (A state that loads parallel to current state)
* **DONE** focal flag should also apply when it comes to the removal of immediates (take a look) (it's probably better to just use partial or forward: no need for focal)
* **DONE** rewrite activation to handle multiple simultaneous activations and multiple transient states (BIG  ONE)
* **DONE** similar to above, make sure that states can be activated serially - one after another with resolves, etc. (might have to use resolve())
* **DONE** finalize stateParams flags
* **DONE** focal state deactivation should also include deactivating views that are under the state, yet have unrelated addresses
* **DONE** put back all callbacks that ui-router supports
* **DONE** put back all trigers that ui-router supports
* **DONE** for triggers, put more specific state triggers (e.g., state-change-start and state-change-start-auth.forgot)
* **DONE** for error triggers and callbacks think about syntax errors and errors in resolves due to reject() (Syntax errors error out to console)
* **DONE** remove invalid-route-handler and handle error routes through backbone router
* **DONE** think about using refresh tag to control if some non-cacheable ancestor states get regenerated when a child state is activated (Handled through caching)
* **DONE** add silent flag for deactivation
* **DONE** make sure that deactivation with trigger events happens for full-fledged states
* **DONE** rework route params again, make sure that each view receives only the route params it is supposed to
* **DONE** if state has no view or views, then delete everything except states and route (no, it can be an abstract state without view(s))
* **DONE** add parallel flag on activate() to indicate other states to load parallel to the focal state
* **DONE** keep record of active states (via reworked history module)
* **DONE** make sure that trigger sequence is unique
* **DONE** complete events module
* **DONE** is it a good idea to define on object on the state to provide callbacks for various state hooks? (for now use hooks api)
* **DONE** when activating from within Backbone router, save the origin url fragment (works fine as it is)
* **DONE** create cancelation asserter
* **DONE** make sure error states receive route object and not direct params
* **DONE** delete unnecessary properties from stateParams: isTransient, time, transient
* **DONE** think about adding callbacks triggered when state is rendered anew (don't see a clear use case yet)
* **DONE** add ignorePending flag to activate() to bypass pending states
* **DONE** change routeParams, dataParams, resolveParams, and directParams to route, data, resolve, and direct, respectively
* **DONE** it is possible for parent states using route data meant for the children, so that may need to be put back in
* **DONE** clean up routeParams handling in the initializer()
* **DONE** clean up stateParams passed within activate()
* **DONE** while in transient state and clicking back and still being taken to the transient state (instead a state gets aborted)
* **DONE** finalize state deactivation api
* **DONE** make state activation event hooks support asynchronous callbacks
* **DONE** explore using const initializer (don't see a clear use case at this time)
* **DONE** in activation(), clean deactivator()
* **DONE** in activation initializer, clean transient state activation
* **DONE** should utils be moved from api under renderer? (yes, I don't see where href() and possible other functions could be used except within templates)
* **DONE** make sure that immediate views (non-main ones) are not hidden within an activationRecord (mattered for when I had multiples flag)
* **DONE** take a look at deactivation as a process of combining appropriate activation sequences and then running through them
* **DONE** fix stateName comparator in preprocessor
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
