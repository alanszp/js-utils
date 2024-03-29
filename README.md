# js-utils

Monorepo for all JS internal dependencies

## Packages

- @alanszp/logger - Logger made simple
- @alanszp/express - Express utils and middlewares
- @alanszp/errors - BaseError for typescript and many more

## Local dev

Clone the repo and run on root folder:

```sh
# Installs all dependencies including per-package ones.
yarn install

# Builds all dependencies for the first time so when you import from another, will have the type definition.
yarn lerna run build
```

> Install general deps (mainly lerna) & all deps from every package and also will link local packages thogether - only if one depends (prod or dev, not peer) on the other. No need to run `lerna bootstrap`. Yarn workspaces ftw :D.

Now you will be able to code in each proyect.

## Publishing new versions

This consist in two steps.

### Bump the version

After merging the changes in prod, you should bump the versions of all modiified packages.

To do this, run:

- `npm login`
- `lerna publish`

> If no change was made in the repo, lerna will output `Current HEAD is already released, skipping change detection.`

Lerna will do it's magic and will ask you to choose which positional version will be bumped (we use [SemVer versioning standard](<[www.google.com](https://semver.org/)>)) and then review and confirm the changes to make

If everything is correct, you will see something like this:

```sh
Changes:
 - @alanszp/logger: 0.0.1 => 1.0.0

? Are you sure you want to create these versions? Yes
lerna info execute Skipping releases
lerna info git Pushing tags...
lerna success version finished
```

This will make two changes:

- First, will update the `package.json` from the package you just bumped and also will change all the other local packages' `package.json` which depends from that package.
- Then, will auto-commit and push those changes to github, and also tag the commit with the package and version number (e.g. `@alanszp/logger@1.0.0`) and push the tag too.

### Publishing to npm
