lessMVC
=======

frame work less Javascript MVC pattern


Seeing a lot of MVC(?) frameworks for large JavaScript applications.
Not still convinced to use one of them.

As a JavaScript programmer in all my career with less serious exposure to Classical languages and have early experince of code ending up as Spaghetti.

Consider jquery core cann’t be avoided. But don’t want anymore framework included.
Later I started believing that a proper pattern can be followed in JavaScript Applications without depending on another framework.

Don’t want to beat JavaScript to behave like a C++/Java.
Instead want to show the pattern which I used for my applications.
Know similar patterns are discussed.
http://en.wikipedia.org/wiki/Model-view-adapter

Models.
Collection of methods which will do Ajax calls to server and fire callbacks along with response on return.
Same Models can be used for different versions of the application, to say Mobile & Desktop.

Views.
Collection of independent Themable User Interface widgets.
HTML can be generated using client side templates like, ejs,mustache etc….
Muti lingual support can be easily integrated.
Views accepts data and event listeners.Listeners are fired on events triggered in Views.
Events can be specific to application, not just standard JavaScript events.
Views can be collection of flat javascript functions or jQuery plugins.

Controller/Adapter/Mediator.
Models & Views are completely independent and wont communicate each other.
Controller acts as a mediator between them.
Controller calls a Model to get/set data along with a callback.
Models usually get/set data asynchronously.
So it fires callback once data is back.
Controller pass this data to View along with some listeners.
Views render UI for the data and fires listeners on triggering of events.
Various views can be there based on the requirement of application.
One view draws the basic container for UI.
Another add a list of items.
Another remove an item from list…….
Events triggered in Views will be specific to the application UI.
Like clicking and ‘X’ icon to delete a row.
So event can be something like ‘DeleteRow’ and listener will be ‘onDeleteRow’.
View can behave one of the below ways.
1. View will remove the row from UI and fire ‘onDeleteRow’ and pass some data back with which Controller can identify which row is removed.
Controller in turn call another Model which can remove that information from db table by doing asynchronous request.
2. View won’t remove the row from UI. It just fire ‘onDeleteRow’ and pass some data back to Controller.
Controller Makes a call to Model and on successfull return call another View to remove row from UI.
Again all these depends on the application.

Rules.
1.Controllers won’t touch HTML DOM, which is only done by Views.
2. Models & Views wont communicate each other.