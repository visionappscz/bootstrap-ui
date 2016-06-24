<p class="lead">This is the docs of Bootstrap UI, a Bootstrap 3 extension for building beautiful web apps user
interfaces.</p>

Bootstrap itself is a great tool for quick creating web app interfaces. Bootstrap UI extends its capabilities with some
features and components that are common in web app UIs, yet too specific to be included in the original framework.

**Technologies used:**

- [**Bootstrap 3**](http://getbootstrap.com) together with [Glyphicons](http://glyphicons.com/) and
[jQuery](http://jquery.com)
- [Bower](http://bower.io)
- [Grunt](http://gruntjs.com)
- [Style guide generator](https://github.com/kss-node/grunt-kss) using
[KSS syntax](http://warpspire.com/kss/syntax/)

<h2 id="why" class="page-header">Why</h2>

Why you need Bootstrap UI on top of Bootstrap:

- **Bootstrap UI** contains the missing components for web apps that are not present in Bootstrap: datepicker, listbox,
  CTAs, navigation components, sticky footer, extensions for table listings, and many others. Especially, we are very
  proud of the JavaScript part: sorting, filtering, confirmation, etc.
- **Bootstrap UI** made it possible to build a consistent library of design patterns that we at
  [VisionApps](http://www.visionapps.cz) use every day when developing responsive HTML prototypes and UIs for our web
  apps. Showcase coming soon!
- **Bootstrap UI** benefits from extending the original Bootstrap codebase at the LESS level. This is why you can easily
  adjust almost anything using just LESS variables.
- **Bootstrap UI** is designed as an extension, not a modification, neither an override of Bootstrap. However, we made
  some design decisions for you and adjusted couple of things to make the UI look beautiful and nicer than default,
  easily recognizable &rdquo;Bootstrap style&ldquo;.
- Of course, everything is mobile first and fully responsive.

<h2 id="install" class="page-header">Install</h2>

The recommended way to install Bootstrap UI is via [Bower](http://bower.io) (assumes you have
[Node.js](http://nodejs.org) and [Bower](http://bower.io) installed in your system).

```
$ bower install --save bootstrap.ui
```

You can also download all releases from [GitHub](https://github.com/visionappscz/bootstrap-ui/releases).

<h2 id="usage" class="page-header">Usage</h2>

### CSS
You will find everything you need in the `dist/css` directory to start using Bootstrap UI styles right away
(the styles link Bootstrap’s Glyphicons from `dist/fonts`).

Link Titillium Web font from [Google Fonts](https://www.google.com/fonts/) and Bootstrap UI CSS in your HTML:

```
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Titillium+Web:400,300,700&amp;subset=latin,latin-ext" />
<link rel="stylesheet" href="bower_components/bootstrap-ui/dist/css/bootstrap-ui.min.css" />
```

### JavaScript
You will find Bootstrap UI JavaScript in the `dist/js` directory.

Please note that jQuery and Bootstrap JavaScript **is not bundled** in Bootstrap UI distribution package, and neither are
other dependencies of Bootstrap UI. You can load them from [CDN](http://www.bootstrapcdn.com) if this option is
available, or better, link the packages managed by Bower:

```
<!-- External JS dependencies -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/moment/min/moment-with-locales.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="bower_components/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js"></script>
<script src="bower_components/select2/select2.min.js"></script>
<!-- Bootstrap UI JS -->
<script src="bower_components/bootstrap-ui/dist/js/bootstrap-ui.min.js"></script>
```

<h2 id="customizing" class="page-header">Customizing</h2>

Loading original LESS styles allows you to customize your Bootstrap UI build. You can pick just the components you want
and recolor the UI by overriding LESS variables (see `src/less/config/variables.less`).

In your LESS styles, import complete Bootstrap UI styles to customize via LESS variables:

```
@external-components-path: 'bower_components/';
@import 'bower_components/bootstrap-ui/src/less/bootstrap-ui';
```

Do not forget to declare `@external-components-path` variable saying where Bower dependencies are installed (relative to
the calling file).

<h2 id="changelog" class="page-header">Changelog</h2>

See [GitHub releases](https://github.com/visionappscz/bootstrap-ui/releases) for the complete changelog.
