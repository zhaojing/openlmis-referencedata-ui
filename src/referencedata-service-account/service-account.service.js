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
     * @name referencedata-service-account.serviceAccountService
     *
     * @description
     * Responsible for retrieving Service Accounts from the server.
     */
    angular
        .module('referencedata-service-account')
        .factory('serviceAccountService', service);

    service.$inject = ['$resource', 'openlmisUrlFactory'];

    function service($resource, openlmisUrlFactory) {

        var authResource = $resource(openlmisUrlFactory('/api/apiKeys/:token'), {}, {
            query: {
                method: 'GET',
                isArray: false,
                url: openlmisUrlFactory('/api/apiKeys')
            }
        });

        var referenceDataResource = $resource(openlmisUrlFactory('/api/serviceAccounts/:token'));

        return {
            create: create,
            query: query,
            remove: remove
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-service-account.serviceAccountService
         * @name create
         *
         * @description
         * Creates new service account.
         *
         * @return {Promise} new Service Account
         */
        function create() {
            return authResource.save().$promise.then(function (apiKey) {
                return referenceDataResource.save({
                    token: apiKey.token
                }).$promise.then(function () {
                    return apiKey;
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-service-account.serviceAccountService
         * @name remove
         *
         * @description
         * Removes service account.
         *
         * @param  {String}  token the API key of Service Account that will be removed
         * @return {Promise}       resolves if Service Account was removed successfully
         */
        function remove(token) {
            return referenceDataResource.remove({
                token: token
            }).$promise.then(function () {
                return authResource.remove({
                  token: token
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-service-account.serviceAccountService
         * @name query
         *
         * @description
         * Gets page of Service Accounts.
         *
         * @param  {Object}  params the search params
         * @return {Promise}        the Service Account page
         */
        function query(params) {
            return authResource.query(params).$promise;
        }
    }
})();
