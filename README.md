# Aptivator

Aptivator (**ap**plications ac**tivator**) is an architectural framework for 
[Backbone]- and [Marionette]-based front-end applications.  The framework was 
designed to minimize the complexity of the derived software and to reduce 
the complexity-driven costs of time, effort, and resources.  Aptivator employs 
hierarchical modularity as the mechanism to structure, manage, and simplify code 
bureaucracy.  Each application is seen as consisting of sub-applications and 
Aptivator provides an explicit process to declare and manage software hierarchy.
By providing an architectural frame, Aptivator allows developers greater focus 
on specific modules that are a core identity of the developed software, 
delegating all the module declaration and management logic to the framework.

For example, suppose an accounting software is constructed and is composed of 
general ledger, reporting, invoicing, user management, and authentication 
programs. The authentication, to pick just one, can be further broken into 
login, logout, sign up, and forgot sub-applications.  And, forgot component can 
be decomposed into forgot password and forgot username programs.  In total, 
there may be tens of these smaller modules in the main software.  Gluing the 
components hierarchically together into what becomes one focal program may be 
challenging.  The challenge gets exacerbated when the woven components must be 
reusable, easily navigatable to in a live browser application, and stable as 
other components are added, removed, or modified or when the "glue" logic 
changes. Aptivator addresses the challenge by providing an out-of-the-box 
infrastructure to define and oversee an application hierarchy and its 
sub-components.  The framework can thus serve as a plug-'n-play architecture, 
allowing construction of new applications out of existing modules declaratively 
and with minimal configuration.

The framework was lightly influenced by [Angular]'s [UI-Router], which presents 
its-derived applications as a tree of states.  UI-Router provides a 
transactional mechanism to shift from one application state to another.  Some 
parts of UI-Router's application programming interface (API) such as states 
(i.e., applications) and resolves are reflected in Aptivator's API.  Aptivator, 
however, goes beyond UI-Router's feature set and provides additional 
functionality such as parallel state activation mechanism, state caching, error 
and transient states, concurrent states, animations, intra-state inter-views 
dependencies, and full regular expression support in route parameters.

For more information and to get started with the framework, please visit 
[Aptivator Documentation Project].

[Aptivator Documentation Project]: https://github.com/aptivator/aptivator-docs
[Angular]: https://angularjs.org/
[UI-Router]: https://ui-router.github.io/
[Backbone]: http://backbonejs.org/
[Marionette]: http://marionettejs.com/
