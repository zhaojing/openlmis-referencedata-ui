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
     * @name openlmis-permissions.loginService
     *
     * @description
     * Extends the service with permissions fetching on login and clearing on logout.
     */
    angular
        .module('openlmis-permissions')
        .config(provider);

    provider.$inject = ['$provide'];
    function provider($provide) {
        $provide.decorator('loginService', decorator);
    }

    decorator.$inject = ['$delegate', 'authorizationService', 'userRightsFactory'];

    function decorator($delegate, authorizationService, userRightsFactory) {

        var originalLogin = $delegate.login,
            originalLogout = $delegate.logout;

        $delegate.login = login;
        $delegate.logout = logout;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.loginService
         * @name login
         *
         * @description
         * Extends the method with permission fetching on login. The fetched permissions are then
         * set in the authorizationService.
         *
         * @param {String} username The username of the person trying to login
         * @param {String} password The password the person is trying to login with
         * @return {Promise} Returns promise from requestLogin
         */
        function login() {
            return originalLogin.apply($delegate, arguments)
            .then(function(response) {
                return userRightsFactory.buildRights(response.userId)
                .then(function(rights) {
                    authorizationService.setRights(rights);
                    return response;
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-permissions.loginService
         * @name logout
         *
         * @description
         * Extends the method with permission cleaning when user logs out.
         *
         * @return {Promise} A resolved promise
         */
        function logout() {
            return originalLogout.apply($delegate, arguments)
            .then(authorizationService.clearRights);
        }
    }
})();
