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
     * @name referencedata-supply-line.supplyLineService
     *
     * @description
     * Responsible for retrieving all supply lines information from server.
     */
    angular
        .module('referencedata-supply-line')
        .service('supplyLineService', service);

    service.$inject = ['$resource', 'referencedataUrlFactory'];

    function service($resource, referencedataUrlFactory) {

        var resource = $resource(referencedataUrlFactory('/api/supplyLines/:id'), {}, {
            getAll: {
                url: referencedataUrlFactory('/api/supplyLines'),
                method: 'GET',
                isArray: true
            },
            search: {
                url: referencedataUrlFactory('/api/supplyLines/search'),
                method: 'POST'
            }
        });

        this.get = get;
        this.getAll = getAll;
        this.search = search;

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-line.supplyLineService
         * @name get
         *
         * @description
         * Gets supply line by id.
         *
         * @param  {String}  id the supply line UUID
         * @return {Promise}    the supply line object
         */
        function get(id) {
            return resource.get({
                id: id
            }).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-line.supplyLineService
         * @name getAll
         *
         * @description
         * Gets all supply lines.

         * @return {Promise} list of all supply lines
         */
        function getAll() {
            return resource.getAll().$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-supply-line.supplyLineService
         * @name search
         *
         * @description
         * Searches supply lines using given parameters.
         *
         * @param  {Object}  params the pagination and query parameters
         * @return {Promise}        the requested page of filtered supply lines
         */
        function search(params) {
            var paginationParams = {
                    page: params.page,
                    size: params.size,
                    sort: params.sort
                },
                queryParams = angular.copy(params);

            delete queryParams.page;
            delete queryParams.size;
            delete queryParams.sort;

            return resource.search(paginationParams, queryParams).$promise;
        }
    }
})();
