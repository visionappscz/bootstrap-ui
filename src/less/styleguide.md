<p class="lead">This the docs of Synergic UI, a Bootstrap 3 extension for building beautiful web apps user
interfaces.</p>

Bootstrap itself is a great tool for quick creating web app interfaces. Synergic UI extends its capabilities with some
features and components that are common in web app UIs, yet too specific to be included in the original framework.

**Technologies used:**

- [**Bootstrap 3**](http://getbootstrap.com) together with [Glyphicons](http://glyphicons.com/) and
[jQuery](http://jquery.com)
- [Bower](http://bower.io)
- [Grunt](http://gruntjs.com)
- [Style guide generator](https://github.com/indieisaconcept/grunt-styleguide) using
[KSS syntax](http://warpspire.com/kss/syntax/)

<h2 id="why" class="page-header">Why</h2>

Why you need Synergic UI on top of Bootstrap:

- **Synergic UI** contains the missing components for web apps that are not present in Bootstrap: datepicker, listbox,
  CTAs, navigation components, sticky footer, extensions for table listings, and many others. Especially, we are very
  proud of the JavaScript part: sorting, filtering, confirmation, etc.
- **Synergic UI** made it possible to build a consistent library of design patterns that we at
  [VisionApps](http://www.visionapps.cz) use every day when developing responsive HTML prototypes and UIs for our web
  apps. Showcase coming soon!
- **Synergic UI** benefits from extending the original Bootstrap codebase at the LESS level. This is why you can easily
  adjust almost anything using just LESS variables.
- **Synergic UI** is designed as an extension, not a modification, neither an override of Bootstrap. However, we made some
  design decisions for you and adjusted couple of things to make the UI look beautiful and nicer than default, easily
  recognizable &rdquo;Bootstrap style&ldquo;.
- Of course, everything is mobile first and fully responsive.

<h2 id="install" class="page-header">Install</h2>

The recommended way to install Synergic UI is via [Bower](http://bower.io) (assumes you have
[Node.js](http://nodejs.org) and [Bower](http://bower.io) installed in your system).

```
$ bower install --save synergic-ui
```

You can also download all releases from [GitHub](https://github.com/visionappscz/synergic-ui/releases).

<h2 id="usage" class="page-header">Usage</h2>

### CSS
You will find everything you need in the `/dist` directory to start using Synergic UI right away.

Link Titillium Web font and complete Synergic UI CSS:

```
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Titillium+Web:400,300,700&amp;subset=latin,latin-ext" />
<link rel="stylesheet" href="bower_components/synergic-ui/dist/css/synergic-ui.min.css" />
```

### JavaScript
Bootstrap JavaScript is **not** included in the distribution package (and neither are the other dependencies). You can
load it from [CDN](http://www.bootstrapcdn.com), or better, link the packages managed by Bower.

```
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/moment/min/moment-with-locales.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
<script src="bower_components/select2/select2.min.js"></script>
<script src="bower_components/synergic-ui/dist/js/synergic-ui.min.js"></script>
```

### The LESS Way
Loading original LESS components allows you to customize your Synergic UI build. You can pick just the components you
want and recolor the UI by overriding LESS variables. Remember that Bootstrap and other dependencies must be loaded
manually in this case.

Import the complete Synergic UI with all dependencies:

```
// Synergic UI and its dependencies.
@import "bower_components/bootstrap/less/bootstrap";
@import "bower_components/less-modules/less/sticky-footer";
@import (inline) "bower_components/select2/select2.css";
@import "bower_components/select2-bootstrap-css/lib/select2-bootstrap";
@import "bower_components/eonasdan-bootstrap-datetimepicker/src/less/_bootstrap-datetimepicker";
@import "bower_components/synergic-ui/src/less/synergic-ui"; // not `dist.less`!
```

<h2 id="changelog" class="page-header">Changelog</h2>

See [GitHub releases](https://github.com/visionappscz/synergic-ui/releases) for the complete changelog.
