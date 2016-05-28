Contributing to Rabble Rouser - Frontend
=======================================

React architectural principles
------------------------------

#### Project structure
* Group components by function in folders.
* Group common components in their own folder(s).
* Specs and source should be stored together - test folder inside each folder.
* Have a separate file for container and presentation components.

#### Code style and structure
* Aim for components as small (and still useful) as possible.
* ES6 functional syntax and stateless components are desired.
* While UI state may need to be stored, it should be very rare.
* Use wrappers eg. wrapped input component, but only if it adds value, for instance, for enforcing consistent behaviour across the application.
* _Undecided_: Split over destructured props parameters vs passing props.
* _Undecided_: Asynchronous actions need to be handled somehow. Thunk is common, but Saga may offer advantages particularly in testing.

#### Forms
* Form state should be held in the Redux store and actions fired when fields change.
* Aim for one action per field, but if there are a huge number of fields, consider a shared form change event fired from each action.

#### Testing
* Test components as unit tests by using shallow rendering.
* We (will) use Enzyme.
* Aim for coverage with end-to-end and unit tests (not so much integration).

##### Presentation components
* Avoid testing too much of the DOM.
* Focus more on logic such as conditional rendering and list rendering.

##### Container components
* Test that actions are dispatched correctly.
