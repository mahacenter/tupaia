# Tupaia

> This is a [mono-repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md)

## Packages

- [access-policy](https://github.com/beyondessential/tupaia/blob/dev/packages/access-policy/README.md)
- [admin-panel](https://github.com/beyondessential/tupaia/blob/dev/packages/admin-panel/README.md)
- [devops](https://github.com/beyondessential/tupaia/blob/dev/packages/devops/README.md)
- [meditrak-app](https://github.com/beyondessential/tupaia/blob/dev/packages/meditrak-app/README.md)
- [meditrak-server](https://github.com/beyondessential/tupaia/blob/dev/packages/meditrak-server/README.md)
- [web-config-server](https://github.com/beyondessential/tupaia/blob/dev/packages/web-config-server/README.md)
- [web-frontend](https://github.com/beyondessential/tupaia/blob/dev/packages/web-frontend/README.md)

## Getting started

### Secrets

Most packages will require a .env file, which can usually be found in lastpass. Use the LOCAL entry
if one exists for the package, otherwise use the DEV entry.

### Dependencies

We use yarn workspaces to manage our packages, which allows us to run `yarn` once at the project
root, and it will install dependencies everywhere.
