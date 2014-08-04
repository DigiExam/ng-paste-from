ng-paste-from
=============

Directive to handle conversion of paste from Excel to scope, [demo](http://digiexam.github.io/ng-paste-from/) and [example implementation](https://github.com/DigiExam/ng-paste-from/tree/gh-pages).

## Example HTML

	<textarea
		id="excel-paste"
		ng-paste-from="users" 
		ng-paste-from-format="['name', 'email']" 
		ng-paste-from-on-validate="onValidate"
		ng-paste-from-on-error="onError"></textarea>

NOTE: It is important that the element that has the ng-paste-from directive supports newlines, otherwise they get excluded and the parse becomes invalid.

## Bindings

| Attribute            | Type             | Description |
| -------------------- | ---------------- | ----------- |
| ng-paste-from        | variable binding | this attribute defines which variable on the scope that should be assigned the array of objects from the parse |
| ng-paste-from-format | array            | defines the order and name how the object properties maps to the columns |
| ng-paste-on-validate | function         | function to custom validate an object, signature onValidate(object, index), return true if valid. |
| ng-paste-on-error    | function         | function to handle errors that occur when parsing the excel data. signature onError(error, index) |

## Errors

Errors that can occur are defined in the constant `ngPasteFromErrors`