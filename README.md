# TSLint Rule: `no-redundant-jsdoc-annotations`

[![npm version][npm]][npm-url]
[![Build Status][tests]][tests-url]
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)

Disallows declaring JSDoc @tags or @annotations that may better expressed and/or better suited via Typescript's syntax. Typescript's syntax, of course, is strongly preferred given the type-related benefits that the language provides via hinting and at compilation time. Ultimately, this rule disallows annotations that can be extracted via Typescript's type engine.

## Rationale

JSDoc provides the opportunity of expressing type definitions in Javascript comments via @tags or @annotations. However, most of those have a comparable and/or inherent way of being expressed by Typescript's syntax, therefore becoming redundant. Additionally, avoiding this type of redundancies may avoid conflicts with tooling that may add automatic JSDoc type annotations at compile time.

[npm]: https://badge.fury.io/js/tslint-no-redundant-jsdoc-annotations.svg
[npm-url]: https://www.npmjs.com/package/tslint-no-redundant-jsdoc-annotations

[tests]: https://travis-ci.org/emilio-martinez/tslint-no-redundant-jsdoc-annotations.svg?branch=master
[tests-url]: https://travis-ci.org/emilio-martinez/tslint-no-redundant-jsdoc-annotations