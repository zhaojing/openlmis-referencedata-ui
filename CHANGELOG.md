5.0.1 / Coming soon
==================

New functionality added in a backwards-compatible manner:

* [OLMIS-2370](https://openlmis.atlassian.net/browse/OLMIS-2370) - Added list and view screens for Orderables.

Bug fixes

* [OLMIS-2445](https://openlmis.atlassian.net/browse/OLMIS-2445) - Button and title capitalization are consistent.

5.0.0 / 2017-05-08
==================

Compatibility breaking changes:

* [OLMIS-2107](https://openlmis.atlassian.net/browse/OLMIS-2107): Add breadcrumbs to top of page navigation
  * All states have been modified to be descendants of the main state.
* [OLMIS-2224](https://openlmis.atlassian.net/browse/OLMIS-2224): Fixed mocking localStorageFactory

New functionality added in a backwards-compatible manner:

* [OLMIS-2140](https://openlmis.atlassian.net/browse/OLMIS-2140): Admin Password Reset
* [OLMIS-2188](https://openlmis.atlassian.net/browse/OLMIS-2188): Admin UI screen View Roles
* [OLMIS-2189](https://openlmis.atlassian.net/browse/OLMIS-2189): Admin UI screen Create new role
* [OLMIS-2190](https://openlmis.atlassian.net/browse/OLMIS-2190): Admin UI screen assign Users to Roles
* [OLMIS-2215](https://openlmis.atlassian.net/browse/OLMIS-2215): Edit User Roles
* [OLMIS-2267](https://openlmis.atlassian.net/browse/OLMIS-2267): Email optional for user setup

Dev and tooling updates made in a backwards-compatible manner:

* [OLMIS-1853](https://openlmis.atlassian.net/browse/OLMIS-1853): Separate push and pull Transifex tasks in build
  * Migrated to dev-ui v3.
* [OLMIS-1609](https://openlmis.atlassian.net/browse/OLMIS-1609): UI i18N message strings are not standardized
