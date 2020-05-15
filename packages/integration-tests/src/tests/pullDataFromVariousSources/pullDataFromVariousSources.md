## Test objectives

- Asserts that `@tupaia/aggregator` (higher level package) can leverage `@tupaia/data-broker`, which in turns uses `@tupaia/dhis-api` in order to pull the requested data. Models defined in `@tupaia/database` are used during the process.

* Data pulling should be agnostic of the data source type (DHIS2, Tupaia DB etc). This means that the core API options should be supported by all data sources, and the response has the same structure.

### Participating packages

- @tupaia/aggregator
- @tupaia/data-broker
- @tupaia/database
- @tupaia/dhis-api

### Mocks

- DHIS2 Authentication
- DHIS2 responses for specific queries on a per-test-case basis
