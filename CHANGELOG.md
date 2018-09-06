5.4.1 / WIP
==================

Improvements:
* [OLMIS-5235](https://openlmis.atlassian.net/browse/OLMIS-5235): Improved performance of login:
** Made the requests when login concurrent (where possible).
** Minimal Facilities are now cached in the LocalDatabase instead of the LocalStorage.

5.4.0 / 2018-08-16
==================

New functionality added in a backwards-compatible manner:
* [OLMIS-2245](https://openlmis.atlassian.net/browse/OLMIS-2245): Added Users number column to Role List screen.
* [OLMIS-4732](https://openlmis.atlassian.net/browse/OLMIS-4732): Added role assignments tables to the User Profile screen.
* [OLMIS-4731](https://openlmis.atlassian.net/browse/OLMIS-4731): Added Change Password button on the User profile screen.
* [OLMIS-4833](https://openlmis.atlassian.net/browse/OLMIS-4833): Added Send Verification Email button on the user update and profile screens.
  * Added visual indication when there is pending verification
* [OLMIS-4980](https://openlmis.atlassian.net/browse/OLMIS-4980): Added Report Only flag to add processing period in edit processing schedule modal.
* [OLMIS-4835](https://openlmis.atlassian.net/browse/OLMIS-4835): Added ability to opt-out from notifications 

Improvements:
* [OLMIS-2998](https://openlmis.atlassian.net/browse/OLMIS-2998): Added served facilities popover to supply line and allowed filtering by program
* [OLMIS-4740](https://openlmis.atlassian.net/browse/OLMIS-4740): Added Jenkinsfile.
* [OLMIS-4730](https://openlmis.atlassian.net/browse/OLMIS-4730): Support new user resource fields
  * Modified user profile screen to allow see and edit own profile
  * Enable email validation
* [OLMIS-3519](https://openlmis.atlassian.net/browse/OLMIS-3519): Improved user password modal
  * user has two options to select: sending reset email or set password manually
  * if user has no email, the send email option is disabled
* [OLMIS-3795](https://openlmis.atlassian.net/browse/OLMIS-3795): Remove code duplication from admin-user-roles routes
* [OLMIS-4795](https://openlmis.atlassian.net/browse/OLMIS-4795): Updated dev-ui to version 8.
* [OLMIS-4813](https://openlmis.atlassian.net/browse/OLMIS-4813): Updated datepickers to use the new syntax.
* [OLMIS-4896](https://openlmis.atlassian.net/browse/OLMIS-4896): Handle new version of auth user endpoint
* [OLMIS-4813](https://openlmis.atlassian.net/browse/OLMIS-4813): Updated ui-components to version 6.0.0.
* [OLMIS-4830](https://openlmis.atlassian.net/browse/OLMIS-4830): Added popover with the list of rights when hover over role on the User Roles and User Profile screens.
  * Reworked typeNameFactory into right and roleType filters.
* [OLMIS-3240](https://openlmis.atlassian.net/browse/OLMIS-3240): Removed duplications in admin-facility modules.
* [OLMIS-4867](https://openlmis.atlassian.net/browse/OLMIS-4867): Add 'ORDERS_TRANSFER' in FULFILLMENT_RIGHTS constant.
* [OLMIS-4984](https://openlmis.atlassian.net/browse/OLMIS-4984): Refactored UserContactDetails to be a separate resource.
* [OLMIS-4985](https://openlmis.atlassian.net/browse/OLMIS-4985): Refactored ReferenceDataUser to be a separate resource.
* [OLMIS-4986](https://openlmis.atlassian.net/browse/OLMIS-4986): Refactored AuthUser to be a separate resource.

Bug fixes:
* [OLMIS-4613](https://openlmis.atlassian.net/browse/OLMIS-4613): Fixed error on User Roles screen when Supervisory Node is without facility
* [OLMIS-4402](https://openlmis.atlassian.net/browse/OLMIS-4402): Fixed column names for associated programs grid in Products view
* [OLMIS-4422](https://openlmis.atlassian.net/browse/OLMIS-4422): Fixed problem with entering the user roles screen.
  * if a user has no a home facility and some home facility roles, an error icon will be displayed next to those role assignments.
  * a user has ability to add new home facility roles but if the user has no home facility, those assignments will be ignored.
* [OLMIS-3675](https://openlmis.atlassian.net/browse/OLMIS-3675): Fixed pagination problems for nested views.
* [OLMIS-5179](https://openlmis.atlassian.net/browse/OLMIS-5179): Fixed problem with entering Supervisory Node Edit screen by getting facilities from cache.


5.3.0 / 2018-04-24
==================

New features:
* [OLMIS-3108:](https://openlmis.atlassian.net/browse/OLMIS-3108) Updated to use dev-ui v7 transifex build process
* [OLMIS-3828](https://openlmis.atlassian.net/browse/OLMIS-3828): Added Service Account list UI.
* [OLMIS-2695](https://openlmis.atlassian.net/browse/OLMIS-2695): Added Processing Schedule screens.
* [OLMIS-4027](https://openlmis.atlassian.net/browse/OLMIS-4027): Added Facility Type screens.

Improvements:

* [OLMIS-3306](https://openlmis.atlassian.net/browse/OLMIS-3306): Added role type column on the role list screen.
* [OLMIS-2285](https://openlmis.atlassian.net/browse/OLMIS-2285): Supported program start date is now editable on facility edit screen.
* [OLMIS-3403](https://openlmis.atlassian.net/browse/OLMIS-3403): Added query params for get facilities and get users.
* [OLMIS-2727](https://openlmis.atlassian.net/browse/OLMIS-2727): Added pagination for user roles tab.
* [OLMIS-3607](https://openlmis.atlassian.net/browse/OLMIS-3607): Added builders for period and schedule.
* [OLMIS-3542](https://openlmis.atlassian.net/browse/OLMIS-3542): Updated password modal title and button to be based on context.
* [OLMIS-3782](https://openlmis.atlassian.net/browse/OLMIS-3782): Added new flag (skipAuthorization) to the program object to match backend changes.
* [OLMIS-2666](https://openlmis.atlassian.net/browse/OLMIS-2666): Added create new program method in program service.
* [OLMIS-3805](https://openlmis.atlassian.net/browse/OLMIS-3805): Updated Roles UI to allow fulfillment roles to non-warehouses.
* [OLMIS-3918](https://openlmis.atlassian.net/browse/OLMIS-3918): Added new flag (supportLocallyFulfilled) to the supported program object to match backend changes.
* [OLMIS-3995](https://openlmis.atlassian.net/browse/OLMIS-3995): Extended LotDataBuilder with the withId method.
* [OLMIS-4087](https://openlmis.atlassian.net/browse/OLMIS-4087): Added new methods (buildAsDistrictHospital, buildAsDistrictStore) to FacilityTypeDataBuilder and updated facilityTypeService to support retrieving several types by ids.
* [OLMIS-4118](https://openlmis.atlassian.net/browse/OLMIS-4118): Show display unit for Dispensable
* [OLMIS-4384](https://openlmis.atlassian.net/browse/OLMIS-4384): Changed Supervisory Node Service to reflect endpoint refactor.
* [OLMIS-3325](https://openlmis.atlassian.net/browse/OLMIS-3325): Added Program column to Requisition Group list screen.

Bug fixes:
* [OLMIS-3501](https://openlmis.atlassian.net/browse/OLMIS-3501): Fixed caching home facility supervised programs.
* [OLMIS-3243](https://openlmis.atlassian.net/browse/OLMIS-3403): Added builders for ObjectReference, Facility, Program etc.
* [OLMIS-3727](https://openlmis.atlassian.net/browse/OLMIS-3727): Fixed getting user's programs.
* [OLMIS-3468](https://openlmis.atlassian.net/browse/OLMIS-3468): Fixed a bug with missing permissions after a relog.
* [OLMIS-3806](https://openlmis.atlassian.net/browse/OLMIS-3806): Fixed date picker to not change selected date
* [OLMIS-3759](https://openlmis.atlassian.net/browse/OLMIS-3759): Fixed program facility select to disable "supervised facility" if none to supervise.
* [OLMIS-4176](https://openlmis.atlassian.net/browse/OLMIS-4176): Fixed problems with loading modal on User Edit screen.
* [OLMIS-3599](https://openlmis.atlassian.net/browse/OLMIS-3599): Use ORDERABLES_MANAGE right instead of PRODUCTS_MANAGE right (it is not used on backend side)
* [OLMIS-4227](https://openlmis.atlassian.net/browse/OLMIS-4227): Fixed checking if role is already assigned.
* [OLMIS-4281](https://openlmis.atlassian.net/browse/OLMIS-4281): Updated Orderable service to use new reference data API.
* [OLMIS-4467](https://openlmis.atlassian.net/browse/OLMIS-4467): All facilities are cached upon login instead of only the active ones.
* [OLMIS-4443](https://openlmis.atlassian.net/browse/OLMIS-4443): Supply Lines list will no allow filtering by all facilities type (instead of only warehouses)
* [OLMIS-4187](https://openlmis.atlassian.net/browse/OLMIS-4187): Fixed no pagination on the Users list and no selected tab on the User Roles

5.2.2 / 2017-11-09
==================

New features:

* [OLMIS-3153](https://openlmis.atlassian.net/browse/OLMIS-3153)
    * Added facilityOperatorsService for communicating with the facilityOperators endpoints
    * Extended facilityService with the ability to save facility
* [OLMIS-3154](https://openlmis.atlassian.net/browse/OLMIS-3154): Changed facility view to edit screen.
* [OLMIS-3228](https://openlmis.atlassian.net/browse/OLMIS-3228): Create Download Current ISA Values page
* [OLMIS-2217](https://openlmis.atlassian.net/browse/OLMIS-2217): Added ability to send reset password email
* [OLMIS-396](https://openlmis.atlassian.net/browse/OLMIS-396): Added upload functionality to manage ISA screen.

Improvements:

* [OLMIS-2857](https://openlmis.atlassian.net/browse/OLMIS-2857): Added username filter to user list screen.
* [OLMIS-3283](https://openlmis.atlassian.net/browse/OLMIS-3283): Added a "Show password" option on password reset screen.
* [OLMIS-3296](https://openlmis.atlassian.net/browse/OLMIS-3296): Reworked facility-program select component to use cached rograms, minimal facilities and permission strings.
* Updated dev-ui version to 6.

Bug fixes:

* Added openlmis-offline as a dependency to the referencedata-program module.
* [OLMIS-3291](https://openlmis.atlassian.net/browse/OLMIS-3291): Fixed incorrect state name.
* [OLMIS-3499](https://openlmis.atlassian.net/browse/OLMIS-3499): Fixed changing username in title header.

5.2.1 / 2017-09-01
==================

Improvements:

* [OLMIS-2780](https://openlmis.atlassian.net/browse/OLMIS-2780): User form now uses minimal facilities endpoint.

New functionality added in a backwards-compatible manner:

* [OLMIS-3085:](https://openlmis.atlassian.net/browse/OLMIS-3085) Made minimal facility list download and cache when user logs in.
* [OLMIS-2696](https://openlmis.atlassian.net/browse/OLMIS-2696): Added requisition group administration screen.
* [OLMIS-2698](https://openlmis.atlassian.net/browse/OLMIS-2698): Added geographic zone administration screens.
* [OLMIS-2853](https://openlmis.atlassian.net/browse/OLMIS-2853): Added view Supply Lines screen.
* [OLMIS-2600](https://openlmis.atlassian.net/browse/OLMIS-2600): Added view Program Settings screen.

Bug fixes:

* [OLMIS-2905](https://openlmis.atlassian.net/browse/OLMIS-2905): User with only POD_MANAGE or ORDERS_MANAGE can now access 'View Orders' page.
* [OLMIS-2714](https://openlmis.atlassian.net/browse/OLMIS-2714): Fixed loading modal closing too soon after saving user.

5.2.0 / 2017-06-22
==================

New functionality added in a backwards-compatible manner:

* [OLMIS-2567](https://openlmis.atlassian.net/browse/OLMIS-2567): Added openlmis-facility-program-select component.
* [OLMIS-2729](https://openlmis.atlassian.net/browse/OLMIS-2729): Added getUserSupportedPrograms to program service.

Improvements:

* [OLMIS-2444](https://openlmis.atlassian.net/browse/OLMIS-2444): Added new "add" button class.
* [OLMIS-2384](https://openlmis.atlassian.net/browse/OLMIS-2384): Changed "email verified" label from text to checkbox and added cancel button to user edit page.
* [OLMIS-2385](https://openlmis.atlassian.net/browse/OLMIS-2385): Changed type message.
* [OLMIS-2495](https://openlmis.atlassian.net/browse/OLMIS-2495): Changed links to buttons on user list screen.
* [OLMIS-2494](https://openlmis.atlassian.net/browse/OLMIS-2494): Name, description and rights will
now properly be marked as required on the Role creation/edit screen.
* [OLMIS-2648](https://openlmis.atlassian.net/browse/OLMIS-2648): When changing user's home facility,
system also prompts for removing roles for old home facility.
* [OLMIS-2689](https://openlmis.atlassian.net/browse/OLMIS-2689): When filtering by home facility on initiate requisition view,
only programs supported by home facility are shown.
* [OLMIS-2446](https://openlmis.atlassian.net/browse/OLMIS-2446): Made Add/Edit title dynamic.
* [OLMIS-2411](https://openlmis.atlassian.net/browse/OLMIS-2411): Supervisory node dropdown always exists
  * If a role is getting assigned that is already assigned, an error notification is showed instead


5.1.0 / 2017-05-26
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
