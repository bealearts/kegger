# Kegger - Join the party [![Build Status](https://github.com/bealearts/kegger/actions/workflows/build.yml/badge.svg)](https://github.com/bealearts/kegger/actions/workflows/build.yml)

> [Homebrew](https://brew.sh/) update notification status icon

## About

MacOS/OSX status icon which gives a visual indication when you have available updates for [Homebrew](https://brew.sh/) packages.

![Demo](docs/demo.gif)

## Install

### Using Homebrew Cask (Recommended)

```shell
brew tap bealearts/tap

brew cask install kegger
```

### Manually

Download Kegger.dmg from https://github.com/bealearts/kegger/releases/latest


## Development

### Local Dev
```shell
make start
```

### Build
```shell
make build
```

### Update Dependencies
```shell
make update
```

## Release

Create a versioned Git tag and push to C.I.
```shell
git tag v2.0.2
git push --tags
```

## Credits

Barrel Icon by [Loren Klein](https://thenounproject.com/lorenklein/) from the Noun Project
