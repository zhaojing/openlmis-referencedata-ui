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
     * @name referencedata-supervisory-node.supervisoryNodeFactory
     *
     * @description
     * Allows the user to retrieve roles with additional info.
     */
    angular
        .module('referencedata-supervisory-node')
        .factory('supervisoryNodeFactory', factory);

    factory.$inject = ['$q', 'facilityService', 'SupervisoryNodeResource'];

    function factory($q, facilityService, SupervisoryNodeResource) {

        var supervisoryNodeResource = new SupervisoryNodeResource();

        return {
            getSupervisoryNode: getSupervisoryNode
        };

        /**
         * @ngdoc method
         * @methodOf referencedata-supervisory-node.supervisoryNodeFactory
         * @name getSupervisoryNode
         *
         * @description
         * Returns a supervisory node. All child nodes facilities have additional info.
         *
         * @param  {String}  id Supervisory Node UUID
         * @return {Promise}    Array of role assignments
         */
        function getSupervisoryNode(id) {
            return $q.all([
                supervisoryNodeResource.get(id),
                facilityService.getAllMinimal()
            ])
                .then(function(responses) {
                    var supervisoryNode = responses[0],
                        facilities = responses[1];
                    supervisoryNode.childNodes.forEach(function(node) {
                        var filtered = facilities.filter(function(facility) {
                            return facility.id === node.facility.id;
                        });
                        if (filtered && filtered.length > 0) {
                            node.$facility = filtered[0];
                        }
                    });
                    return supervisoryNode;
                });
        }
    }
})();
