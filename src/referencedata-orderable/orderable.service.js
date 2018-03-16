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
     * @name referencedata-orderable.orderableService
     *
     * @description
     * Responsible for retrieving orderables from the server.
     */
    angular
        .module('referencedata-orderable')
        .factory('orderableService', service);

    service.$inject = ['openlmisUrlFactory', '$resource'];

    function service(openlmisUrlFactory, $resource){

        var resource = $resource(openlmisUrlFactory('/api/orderables/:id'), {}, {
                'search': {
                    url: openlmisUrlFactory('/api/orderables'),
                    method: 'GET'
                }
            });

        return {
            get: get,
            search: search
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-orderable.orderableService
         * @name get
         *
         * @description
         * Gets orderable by id.
         *
         * @param  {String}  id orderable UUID
         * @return {Promise}    orderable info
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-orderable.orderableService
         * @name search
         *
         * @description
         * Searches for orderables with given params, i.e.:
         * {
         *   page: 1,
         *   size: 10,
         *   code: 'code',
         *   name: 'name',
         *   description: 'desc',
         *   program: 'program-id'
         * }
         *
         * @param  {Object}  paginationParams the pagination params
         * @param  {Object}  queryParams      the search params
         * @return {Promise}                  the page of orderables
         */
        function search(paginationParams, queryParams) {
            var params = angular.merge({}, paginationParams, queryParams);
            return resource.search(params).$promise;
        }
    }
})();
