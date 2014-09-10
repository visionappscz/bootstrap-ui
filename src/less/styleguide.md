## Built on Bootstrap 3

This a living styleguide of **Synergic UI**, a UI library for building responsive admin interfaces. It is a sleek,
**lightweight extension** built on the shoulders of a
giant&thinsp;—&thinsp;[**Bootstrap 3**](http://www.getbootstrap.com).

Bootstrap itself is a great tool for quick creating admin interfaces. Synergic UI extends its capabilities with some
features and components that are common in admin UIs, yet too specific to be included in the original framework.

Synergic UI has been made by professionals for professionals. It is rather a styleguide than a ready-to-use
administration frontend with a dashboard full of eye-catching widgets. The aim of Synergic UI is to enable building
quality, responsive, intuitive, and easy-to-use admin interfaces that look and work well out of box, with as few lines
of code on top of Bootstrap’s codebase as possible.

**Technologies used:**

- [**Bootstrap 3**](http://www.getbootstrap.com) together with [Glyphicons](http://glyphicons.com/) and
[jQuery](http://www.jquery.com)
- [LESS modules](https://github.com/adamkudrna/less-modules)
- [Bower](http://bower.io)
- [Grunt](http://gruntjs.com)
- [Styleguide generator](https://github.com/indieisaconcept/grunt-styleguide) using
[KSS syntax](http://warpspire.com/kss/syntax/)

## <span id="install"></span>Install
The recommended way to install Synergic UI is via [Bower](http://bower.io) (assumes you have
[Node.js](http://nodejs.org) and Bower installed in your system).

```
$ bower install synergic-ui
```

## <span id="usage"></span>Usage
You will find everything you need in the `/dist` directory.

Link Open Sans font and complete Synergic UI CSS:

```
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Open+Sans:400,300,700&amp;subset=latin,latin-ext" type="text/css" />
<link rel="stylesheet" href="bower_components/synergic-ui/dist/css/synergic-ui.min.css" type="text/css" />
```

Bootstrap JS is **not** included in this package. We recommend you to load it from [CDN](http://www.bootstrapcdn.com/),
you can also link to the package managed by Bower. Do not forget that Bootstrap needs jQuery to work.

```
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
```

Link Synergic UI JS components you want:

```
<script src="bower_components/synergic-ui/dist/js/sortable-tables.js"></script>
```

You can also use LESS and CoffeeScript source files that are located in `/src` and build CSS and JS packages yourself
just from the components you need. It is up to you.

## <span id="changelog"></span>Changelog

### NEXT VERSION

* Upgrade to LESS modules 0.3 with default grid columns
* Various style guide fixes and adjustments

### 0.1.1
Release date: 1 September 2014

* Use Bootstrap mixins for layout

### 0.1.0
Release date: 29 August 2014

* Created styleguide
