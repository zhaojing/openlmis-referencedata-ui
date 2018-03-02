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
     * @name referencedata-facility-type.facilityTypeService
     *
     * @description
     * Responsible for retrieving all facilityType information from server.
     */
    angular
        .module('referencedata-facility-type')
        .service('facilityTypeService', service);

    service.$inject = [
        '$resource', 'referencedataUrlFactory'
    ];

    function service($resource, referencedataUrlFactory) {

            var resource = $resource(referencedataUrlFactory('/api/facilityTypes/:id'), {}, {
                query: {
                    url: referencedataUrlFactory('/api/facilityTypes/'),
                    method: 'GET',
                    isArray: false
                },
            });

            this.get = get;
            this.query = query;

            /**
             * @ngdoc method
             * @methodOf referencedata-facility-type.facilityTypeService
             * @name get
             *
             * @description
             * Retrieves facility type by id.
             *
             * @param  {String}  facilityTypeId facilityType UUID
             * @return {Promise}                facilityType promise
             */
            function get(facilityTypeId) {
                return resource.get({
                    id: facilityTypeId
                }).$promise;
            }

            /**
             * @ngdoc method
             * @methodOf referencedata-facility-type.facilityTypeService
             * @name getAll
             *
             * @description
             * Retrieves all facility types by ids.
             *
             * @param  {Object}  queryParams the search parameters
             * @return {Promise} Page of facility types
             */
            function query(queryParams) {
                return resource.query(queryParams).$promise;
            }

        }
    })();
