# Pixdif Command-Line Interface
[![Build Status](https://github.com/pixdif/cli/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/pixdif/cli/actions?query=workflow%3ANode.js%20CI+branch%3Amain)
[![Npm Package](https://img.shields.io/npm/v/@pixdif/cli.svg)](https://npmjs.org/package/@pixdif/cli)

This is a command-line tool aimed to compare visual differences of files and generate test reports.

## License

[MIT](http://opensource.org/licenses/MIT)

## Installation

```sh
npm install @pixdif/cli
npm install @pixdif/png-parser # If you need to compare PNG images.
npm install @pixdif/pdf-parser # If you need to compare PDF documents.
npm install @pixdif/html-reporter # If you need to generate a test report into a web page.
```

## Features

Compare two files.

```ts
pixdif cmp <expected> <actual>
```

Convert a file (e.g. PDF) into multiple PNG images.

```sh
pixdif convert <input>
```

Compare some files in 2 directories.

```sh
pixdif diff <expected directory> <actual directory> <file glob pattern>
```

Start a server to view test reports and update baselines.

```sh
pixdif serve
```

Check more details with `--help`. It's powered by and documented with [yargs](https://yargs.js.org/).

```sh
pixdif --help
pixdif <command> --help
```
