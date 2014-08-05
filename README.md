# ng-paste-from

AngularJS directive that handles conversion of paste from Excel to scope.

## Demo

[Try a demo of ng-paste-from.](http://digiexam.github.io/ng-paste-from/)

## Example HTML

	<textarea
		id="excel-paste"
		ng-paste-from="users" 
		ng-paste-from-format="['name', 'email']" 
		ng-paste-from-on-validate="onValidate"
		ng-paste-from-on-error="onError"></textarea>

NOTE: It is important that the element that has the ng-paste-from directive supports newlines, otherwise they get excluded and the parse becomes invalid.

## Attributes

| Attribute            | Type             | Description |
| -------------------- | ---------------- | ----------- |
| ng-paste-from        | variable binding | this attribute defines which variable on the scope that should be assigned the array of objects from the parse |
| ng-paste-from-format | array            | defines the order and name how the object properties maps to the columns |
| ng-paste-on-validate | function         | function to custom validate an object, signature onValidate(object, index), return true if valid. |
| ng-paste-on-error    | function         | function to handle errors that occur when parsing the excel data. signature onError(error, index) |

## Errors passed to the on error callback

Error | Description
--- | ---
NGPASTEFROM_INVALID_COLUMN_LENGTH | The processed row does not have the correct number of columns 
NGPASTEFROM_FAILED_VALIDATION | The processed row failed validation 

## Getting started with development

1. Install NodeJS ([nodejs.org](http://nodejs.org/))
2. Install Gulp globally: `npm install -g gulp`
3. Fork the repo and clone it. ([How to do it with GitHub.](https://help.github.com/articles/fork-a-repo))
4. Go into the project folder: `cd ng-paste-from`
5. Install the project dependencies: `npm install`
6. Build the project files: `gulp`
  * Build them whenever they change: `gulp watch`

To make development of ng-paste-from easier you can check out the `master` branch in one directory and the `gh-pages` branch in another, then symlink the dist files from `master` into the `lib` directory in `gh-pages`, and change the includes in `index.html` to use those versions.

## Browser compatability

Chrome, Firefox, Safari and IE9+

## License

Licensed under [MIT](LICENSE)

Copyright (C) 2014 DigiExam
