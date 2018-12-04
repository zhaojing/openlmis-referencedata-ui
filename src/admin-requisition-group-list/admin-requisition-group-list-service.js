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
     * @name admin-requisition-group-list.AdminRequisitionGroupListService
     *
     * @description
     * Prepared Requisition Group object to be displayable by the Requisition Group list page.
     */
    angular
        .module('admin-requisition-group-list')
        .service('adminRequisitionGroupListService', service);

    service.$inject = [ 'requisitionGroupService', 'facilityService', 'ObjectMapper' ];

    function service(requisitionGroupService, facilityService, ObjectMapper) {

        service.prototype.search = search;

        /**
         * @ngdoc method
         * @methodOf admin-requisition-group-list.AdminRequisitionGroupListService
         * @name search
         *
         * @description
         * Searches Requisition Groups using given parameters.
         *
         * @param  {Object}  paginationParams the pagination parameters
         * @param  {Object}  queryParams      the search parameters
         * @return {Promise}                  the requested page of filtered requisition groups.
         */
        function search(paginationParams, queryParams) {
            return requisitionGroupService.search(paginationParams, queryParams)
                .then(function(page) {
                    var requisitionGroups = page.content;
                    var facilityIds = getFacilityIds(requisitionGroups);

                    return facilityService.query({
                        id: facilityIds,
                        page: 0,
                        size: facilityIds.length
                    }).then(function(facilities) {
                        var facilitiesMap = new ObjectMapper().map(facilities);
                        combaineGroupsWithFacilities(requisitionGroups, facilitiesMap);
                        return facilities;
                    })
                        .then(function() {
                            return page;
                        });
                });
        }

        function combaineGroupsWithFacilities(requisitionGroups, facilitiesMap) {
            return requisitionGroups.map(function(group) {
                if (group.supervisoryNode && group.supervisoryNode.facility) {
                    group.supervisoryNode.facility = facilitiesMap[group.supervisoryNode.facility.id];
                }

                return group;
            });
        }

        function getFacilityIds(requisitionGroups) {
            return requisitionGroups.map(function(group) {
                if (group.supervisoryNode && group.supervisoryNode.facility) {
                    return group.supervisoryNode.facility.id;
                }

                return undefined;
            }).filter(function(elem) {
                return elem !== undefined;
            });
        }

    }

})();
