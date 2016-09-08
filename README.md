# [Bootstrap UI](http://www.bootstrap-ui.com)

[![Bower version](https://badge.fury.io/bo/bootstrap.ui.svg)](http://badge.fury.io/bo/bootstrap.ui)
[![devDependency Status](https://david-dm.org/visionappscz/bootstrap-ui/dev-status.svg)](https://david-dm.org/visionappscz/bootstrap-ui#info=devDependencies)
[![Build Status](https://travis-ci.org/visionappscz/bootstrap-ui.svg?branch=master)](https://travis-ci.org/visionappscz/bootstrap-ui)

Bootstrap UI is a [Bootstrap 3](http://getbootstrap.com) extension for building beautiful web apps user
interfaces. Migration to Bootstrap 4
[is planned in the future|https://github.com/visionappscz/bootstrap-ui/issues/94]. 

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

1. Update version number in `package.json`
2. `$ grunt dist`
3. `$ git commit -m "Bump version"`
4. `$ git tag <SEMANTIC_VERSION_NUMBER>`
5. `$ git push --follow-tags`
6. Add the version with change log to [GitHub Releases page](https://github.com/visionappscz/bootstrap-ui/releases)
7. Deploy docs to production (outside of GitHub)

## License

Code is licensed under [MIT](https://github.com/visionappscz/bootstrap-ui/blob/master/LICENSE).
