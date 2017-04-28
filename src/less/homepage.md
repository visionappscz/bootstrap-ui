<p class="lead">This is the documentation of Bootstrap UI, a Bootstrap 3 extension for building beautiful web app user
interfaces.</p>

**Technologies used:**

- [**Bootstrap 3**](http://getbootstrap.com) together with [Glyphicons](http://glyphicons.com/) and
[jQuery](http://jquery.com)
- [Bower](http://bower.io)
- [Grunt](http://gruntjs.com)
- [Style guide generator](https://github.com/kss-node/grunt-kss) using
[KSS syntax](http://warpspire.com/kss/syntax/)

<h2 id="installation" class="page-header">Installation</h2>

For both installation methods must have [Node.js](http://nodejs.org) installed.

### Npm registry
The recommended way to install Bootstrap UI is from the npm registry.

```
$ npm install --save bootstrap-ui
```

Or if you use [Yarn](https://yarnpkg.com):

```
$ yarn add bootstrap-ui
```

### Bower
You can also install it via [Bower](http://bower.io).
However please do note that bower is [deprecated](https://bower.io/).

```
$ bower install --save bootstrap.ui
```

### Download
All releases can also be downloaded from [GitHub](https://github.com/visionappscz/bootstrap-ui/releases).

<h2 id="usage" class="page-header">Usage</h2>

### CSS
You will find everything you need in the `dist/css` directory to start using Bootstrap UI styles right away
(the styles link Bootstrap’s Glyphicons from `dist/fonts`).

Link Titillium Web font from [Google Fonts](https://www.google.com/fonts/) and Bootstrap UI CSS in your HTML:

```
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Titillium+Web:400,300,700&amp;subset=latin,latin-ext" />
<link rel="stylesheet" href="bower_components/bootstrap.ui/dist/css/bootstrap-ui.min.css" />
```

### JavaScript
You will find Bootstrap UI JavaScript in the `dist/js` directory.

Please note that jQuery and Bootstrap JavaScript **is not bundled** in the Bootstrap UI distribution package, and neither are
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
<script src="bower_components/bootstrap.ui/dist/js/bootstrap-ui.min.js"></script>
```

<h2 id="customizing" class="page-header">Customizing</h2>

Loading original LESS styles allows you to customize your Bootstrap UI build. You can pick just the components you want
and recolor the UI by overriding LESS variables (see `src/less/config/variables.less`).

In your LESS styles, import complete Bootstrap UI styles to customize via LESS variables:

```
@external-components-path: 'bower_components/';
@import 'bower_components/bootstrap.ui/src/less/bootstrap-ui';
```

Do not forget to declare `@external-components-path` variable saying where Bower dependencies are installed (relative to
the calling file).

<h2 id="changelog" class="page-header">Changelog</h2>

See [GitHub releases](https://github.com/visionappscz/bootstrap-ui/releases) for the complete changelog.
