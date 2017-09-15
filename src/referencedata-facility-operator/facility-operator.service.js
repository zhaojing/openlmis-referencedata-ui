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
     * @name referencedata-facility-operator.facilityOperatorService
     *
     * @description
     * Communicates with the facilityOperators endpoints.
     */
    angular
        .module('referencedata-facility-operator')
        .service('facilityOperatorService', facilityOperatorService);

    facilityOperatorService.$inject = ['$resource', 'referencedataUrlFactory'];

    function facilityOperatorService($resource, referencedataUrlFactory) {
        var service = this,
            resource = $resource(referencedataUrlFactory('/api/facilityOperators'));

        service.getAll = getAll;

        /**
         * @ngdoc method
         * @methodOf referencedata-facility-operator.facilityOperatorService
         * @name getAll
         *
         * @description
         * Retrieves the list of all facility operators.
         *
         * @return  {Promise}   the promise resolving to the list of all facility operators
         */
        function getAll() {
            return resource.query().$promise;
        }
    }

})();
