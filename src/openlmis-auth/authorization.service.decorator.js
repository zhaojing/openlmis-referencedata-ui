/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-auth.authorizationService
     *
     * @description
     * Adds rights related methods back into the authorizationService. This is
     * meant to be a temporary fix until all rights related functions can be
     * reworked to use the permissions service.
     */
    
    angular.module('openlmis-auth')
        .config(config);

    config.$inject = ['$provide'];

    function config($provide) {
        $provide.decorator('authorizationService', decorator);
    }

    decorator.$inject = ['$delegate', '$filter', 'localStorageService'];

    function decorator($delegate, $filter, localStorageService) {

        var storageKeys = {
            'USER_ROLE_ASSIGNMENTS': 'ROLE_ASSIGNMENTS'
        };
        
        $delegate.getRights = getRights;
        $delegate.setRights = setRights;
        $delegate.clearRights = clearRights;
        
        $delegate.hasRight = hasRight;
        $delegate.hasRights = hasRights;
        $delegate.getRightByName = getRightByName;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name getRights
         *
         * @description
         * Retrieves the list of user rights from the local storage.
         *
         * @return {Array} the list of user rights
         */
        function getRights() {
            return angular.fromJson(localStorageService.get(storageKeys.USER_ROLE_ASSIGNMENTS));
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name setRights
         *
         * @description
         * Saves the given rights to the local storage.
         *
         * @param {Array} rights the list of rights
         */
        function setRights(rights) {
            localStorageService.add(
                storageKeys.USER_ROLE_ASSIGNMENTS,
                angular.toJson(rights)
            );
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name clearRights
         *
         * @description
         * Removes user rights from the local storage.
         */
        function clearRights() {
            localStorageService.remove(storageKeys.USER_ROLE_ASSIGNMENTS);
        }


        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name hasRight
         *
         * @description
         * Checks whether user has the given right. If the details object is passed the validation
         * will be more strict.
         *
         * @param  {String}  rightName the name of the right
         * @param  {Object}  details   (optional) the details about the right
         * @return {Boolean}           true if the user has the right, false Otherwise
         */
        function hasRight(rightName, details) {
            if (!rightName) {
               throw "Right name is required";
            }

            var rights = $filter('filter')(getRights(), {
                name: rightName
            }, true);

            if (!rights) return false;

            if (rights.length) {
                var right = rights[0],
                    hasRight = true;

                if (rightName && details) {

                    if (details.programCode) {
                        hasRight = hasRight && right.programCodes.indexOf(details.programCode) > -1;
                    }

                    if (details.programId) {
                        hasRight = hasRight && right.programIds.indexOf(details.programId) > -1;
                    }

                    if (details.warehouseCode) {
                        hasRight = hasRight && right.warehouseCodes.indexOf(details.warehouseCode) > -1;
                    }

                    if (details.warehouseId) {
                        hasRight = hasRight && right.warehouseIds.indexOf(details.warehouseId) > -1;
                    }

                    if (details.supervisoryNodeCode) {
                        hasRight = hasRight && right.supervisoryNodeCodes.indexOf(details.supervisoryNodeCode) > -1;
                    }

                    if (details.supervisoryNodeId) {
                        hasRight = hasRight && right.supervisoryNodeIds.indexOf(details.supervisoryNodeId) > -1;
                    }
                }

                return hasRight;
            }

            return false;
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name hasRights
         *
         * @description
         * Checks whether user has the given rights.
         *
         * @param  {Array}   rightName the name of the right
         * @param  {Boolean} areAllRightsRequired indicates if all given rights are required
         * @return {Boolean}                      true if user has at least one/all of rights
         */
        function hasRights(rights, areAllRightsRequired) {
            var hasPermission;
            if(areAllRightsRequired) {
                hasPermission = true;
                angular.forEach(rights, function(right) {
                    if(!hasRight(right)) hasPermission = false;
                });
                return hasPermission;
            } else {
                hasPermission = false;
                angular.forEach(rights, function(right) {
                    if(hasRight(right)) hasPermission = true;
                });
                return hasPermission;
            }
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-auth.authorizationService
         * @name  getRightByName
         *
         * @description
         * Returns id of right with given name.
         *
         * @param  {String} rightName name of right which we want to get
         * @return {Object}           id of right which has the given name
         */
        function getRightByName(rightName) {
            var rights = $filter('filter')(getRights(), {
                name: rightName}, true);
            return angular.copy(rights[0]);
        }
    }


})();
