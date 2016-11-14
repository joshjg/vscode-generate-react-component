# generate-react-component

Simple, template-based React component and Redux container generator for VS Code. [Atom version here.](https://github.com/joshjg/generate-react-component)

## Usage
* Right click any directory in the explorer panel
* Select component or container
* Input name and choose options
* Submit

## What's the deal with these files?

The default templates are opinionated, admittedly. They adhere to the principles of feature-based structuring, as promoted in [this article by Max Stoiber](https://www.smashingmagazine.com/2016/09/how-to-scale-react-applications/), and component/container separation, [explained here by Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.4url8spu4).
* Modular CSS with [css-modules](https://github.com/css-modules/css-modules) and [react-css-modules](https://github.com/gajus/react-css-modules)
* Containers have their own actions, constants, and reducers: see [Redux](https://github.com/reactjs/redux) and [react-redux](https://github.com/reactjs/react-redux)
* `index.js` simply passes the component through so you can `import SomeComponent from '/components/SomeComponent'`

However, this package does not force these principles. You can easily customize the templates to match your own tech stack.

## Extension Settings

The component and container templates are completely customizable. You can add additional boolean options to the generator panel from the package's settings. One option is included by default: `class` determines whether to generate a class-based component instead of a functional component.

This extension contributes the following settings:

* `generate-react-component.conditionals`: Array of strings which will toggle certain portions of your templates.
* `generate-react-component.componentTemplatePath`: Absolute path to custom **component** template directory. If left blank, defaults to built-in template.
* `generate-react-component.containerTemplatePath`: Absolute path to custom **container** template directory. If left blank, defaults to built-in template.

### Syntax

Template syntax is very simple:

* Any occurrence of `__ComponentName__` in a filename or a file's content will be replaced with the user's text input.
* Any text surrounded by `/* IF condition */` and `/* ENDIF */`, where `condition` is the name of an option (definted in the package settings) will be removed unless `condition` is enabled (or invalid)
* Any text surrounded by `/* IF !condition */` and `/* ENDIF */` will be removed unless `condition` is disabled (or invalid)
* Any remaining `/* IF */` or `/* ENDIF */` comments will be removed, but the text between them will be untouched
