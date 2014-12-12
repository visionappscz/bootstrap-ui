## Built on Bootstrap 3

This a living style guide of **Synergic UI**, a UI library for building responsive admin interfaces. It is a sleek,
**lightweight extension** built on the shoulders of a
giant&thinsp;—&thinsp;[**Bootstrap 3**](http://www.getbootstrap.com).

Bootstrap itself is a great tool for quick creating admin interfaces. Synergic UI extends its capabilities with some
features and components that are common in admin UIs, yet too specific to be included in the original framework.

Synergic UI has been made by professionals for professionals. It is rather a style guide than a ready-to-use
administration frontend with a dashboard full of eye-catching widgets. The aim of Synergic UI is to enable building
quality, responsive, intuitive, and easy-to-use admin interfaces that look and work well out of box, with as few lines
of code on top of Bootstrap’s codebase as possible.

**Technologies used:**

- [**Bootstrap 3**](http://www.getbootstrap.com) together with [Glyphicons](http://glyphicons.com/) and
[jQuery](http://www.jquery.com)
- [LESS modules](https://github.com/adamkudrna/less-modules)
- [Bower](http://bower.io)
- [Grunt](http://gruntjs.com)
- [Style guide generator](https://github.com/indieisaconcept/grunt-styleguide) using
[KSS syntax](http://warpspire.com/kss/syntax/)

## <span id="install"></span>Install
The recommended way to install Synergic UI is via [Bower](http://bower.io) (assumes you have
[Node.js](http://nodejs.org) and Bower installed in your system).

```
$ bower install --save synergic-ui
```

You can also download all releases from [GitHub](https://github.com/synergic-cz/synergic-ui/releases).

## <span id="usage"></span>Usage

### CSS
You will find everything you need in the `/dist` directory to start using Synergic UI right away.

Link Open Sans font and complete Synergic UI CSS:

```
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:400,300,700&amp;subset=latin,latin-ext" />
<link rel="stylesheet" href="bower_components/synergic-ui/dist/css/synergic-ui.min.css" />
```

### JavaScript
Bootstrap JavaScript is **not** included in this package. We recommend loading it from
[CDN](http://www.bootstrapcdn.com/), you can also link to the package managed by Bower. Do not forget that Bootstrap
needs jQuery to work.

Example use (Bootstrap and jQuery installed by Bower):

```
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
```

Link all Synergic UI JS components:

```
<script src="bower_components/synergic-ui/dist/js/synergic-ui.min.js"></script>
```

Or link just the components you want:

```
<script src="bower_components/synergic-ui/src/js/confirmation.js"></script>
<script src="bower_components/synergic-ui/src/js/filterable.js"></script>
<script src="bower_components/synergic-ui/src/js/sortable-table.js"></script>
```

### LESS
Loading original LESS components allows you to customize your Synergic UI build. You can pick just the components you
want and recolor the UI by overriding LESS variables. Remember that Bootstrap and LESS modules dependencies must be
loaded manually in this case.

Full Synergic UI using custom colors, example use:

```
// Synergic UI and its dependencies. See `dist.less` for the complete list including external components.
@import "../bower_components/bootstrap/less/bootstrap";
@import "../bower_components/less-modules/less/less-modules";
@import "../bower_components/synergic-ui/src/less/synergic-ui"; // not `dist.less`!

// Configuration: custom colors etc.; must be last to override.
@import "config/variables";
```

## <span id="changelog"></span>Changelog

### NEXT VERSION

Release date: FIXME

* Completely refactored Panel Menu component
* Added responsive button variant
* Configuration of Teaser component
* Optimized performance of JavaScript components
* Minor modification of Sortable Table component data-api: `data-sortable-onload` is now `data-sort-onload`
* Use Travis CI to test builds continuously
* Renamed Grunt task for remote testing to test-remote
* Various improvements and fixes

### 0.5.0

Release date: 10 November 2014

* New components:
  * Confirmation
  * Filterable
* JavaScript Sortable Table component rewritten from the ground up to be compatible with Bootstrap JS components
* CoffeeScript is no longer used
* Test all custom JS with QUnit
* Restructured common components
* Various style guide improvements

### 0.4.0

Release date: 7 November 2014

* New components:
  * Bootstrap Datetimepicker
  * Filter
  * Listbox (based on select2)
* Renamed main LESS files (see [Usage &rarr; LESS](#less) for more)
* Added alignment class in Tables component
* Images in Thumbnail component now can be defined as background to achieve nicely centered and filled thumbnails
* Use BrowserSync for comfortable local development

### 0.3.0

Release date: 29 September 2014

* Synergic UI now can be easily customized via LESS
* Teaser and Back link fixes
* Various minor fixes

### 0.2.0
Release date: 27 September 2014

* New components:
  * Panel menu
  * Article
  * Teaser
  * Gallery
  * Back link
  * Input groups
* Footer now requires `.footer-sticky` class to be sticky
* Upgrade to LESS modules 0.3 with default grid columns
* Various style guide fixes and adjustments

### 0.1.1
Release date: 1 September 2014

* Use Bootstrap mixins for layout

### 0.1.0
Release date: 29 August 2014

* Created style guide
