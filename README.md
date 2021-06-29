# [Bootstrap UI](http://www.bootstrap-ui.com)

[![npm Version](https://badge.fury.io/js/bootstrap-ui.svg)](https://www.npmjs.com/package/bootstrap-ui)
[![devDependency Status](https://david-dm.org/visionappscz/bootstrap-ui/dev-status.svg)](https://david-dm.org/visionappscz/bootstrap-ui#info=devDependencies)
[![Build Status](https://travis-ci.org/visionappscz/bootstrap-ui.svg?branch=master)](https://travis-ci.org/visionappscz/bootstrap-ui)

**⚠️ Bootstrap UI is in maintenance mode. There are no plans to upgrade to a higher version of Bootstrap since v4 introduced most of what we missed in v3.**

Bootstrap UI is a [Bootstrap 3](http://getbootstrap.com) extension for building beautiful web apps user
interfaces.

Get started at [www.bootstrap-ui.com](http://www.bootstrap-ui.com)!

## Contributing

1. Bootstrap UI shouldn't contain anything that can be easily achieved with vanilla Bootstrap.
2. Every part of Bootstrap UI should be an opt-in extension, not a modification of Bootstrap. There is only one
   exception and that is basic typography.
3. Documentation only describes usage of each component. Design patterns are presented in the
   [Bootstrap UI Demo](https://github.com/visionappscz/demo.bootstrap-ui.com) project.

## Versioning

Bootstrap UI is maintained under the [Semantic Versioning guidelines](http://semver.org/).

See the [Releases section of the GitHub project](https://github.com/visionappscz/bootstrap-ui/releases) for changelogs for each release version of Bootstrap UI.

## Breaking Changes

1. When filing an issue which would result in a breaking change, mark the issue with the [BC](https://github.com/visionappscz/bootstrap-ui/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3ABC) label.
2. Should an alternative functionality be implemented while keeping the original solution available until next major release, mark the original functionality as deprecated both in code and documentation. Make sure that all deprecated functionality is removed with each major release.

In both cases include migration path in issue's description (and later in release changelog).

## Releasing New Version

1. Update version number in `package.json` and `package-lock.json`.
2. `$ npm run dist`
3. `$ git checkout -b release/<VERSION>`
4. `$ git commit -am "Bump version"`
5. `$ git push`
6. Merge the branch via PR.
7. Create new release on
   [GitHub Releases page](https://github.com/visionappscz/bootstrap-ui/releases)
   using version number from step 1.

## Don’t Forget

* `demo.bootstrap-ui.com`
    * Update package version in `package.json` 
* `www.bootstrap-ui.com`
    * Update package version in `package.json`
    * Update number in button i.e. &ldquo;WHAT’S NEW IN x.x&rdquo; 

## License

Code is licensed under [MIT](https://github.com/visionappscz/bootstrap-ui/blob/master/LICENSE).
