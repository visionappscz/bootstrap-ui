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

Link Titillium Web font and complete Synergic UI CSS:

```
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Titillium+Web:400,300,700&amp;subset=latin,latin-ext" />
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
See [GitHub releases](https://github.com/synergic-cz/synergic-ui/releases) for the complete changelog.
