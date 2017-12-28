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
     * @name openlmis-currency.loginService
     *
     * @description
     * Manages saved currency settings for the current user.
     */
    angular
        .module('openlmis-currency-cache')
        .config(provider);

    provider.$inject = ['$provide'];
    function provider($provide) {
        $provide.decorator('loginService', decorator);
    }

    decorator.$inject = ['$delegate', 'currencyService'];

    function decorator($delegate, currencyService) {

        var originalLogin = $delegate.login;

        $delegate.login = login;

        return $delegate;

        /**
         * @ngdoc method
         * @methodOf openlmis-currency.loginService
         * @name login
         *
         * @description
         * Retrieves the currency settings from the server, if the server does not provide them,
         * they are retrieved from the config.
         */
        function login() {
            return originalLogin.apply($delegate, arguments)
            .then(function(response) {
                return currencyService.getCurrencySettings()
                .catch(currencyService.getCurrencySettingsFromConfig)
                .then(function() {
                    return response;
                });
            });
        }
    }
})();
