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
     * @ngdoc filter
     * @name referencedata-supervisory-node.filter:supervisoryNode
     *
     * @description
     * Displays the supervisoryNode in a user-friendly format by adding associated facility when appropriate.
     *
     * @param   {Object} supervisoryNode the supervisory node to be displayed
     * @return  {String}                 the supervisory nodes name
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{supervisoryNode | supervisoryNode}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('supervisoryNode')(supervisoryNode);
     * ```
     */
    angular
        .module('referencedata-supervisory-node')
        .filter('supervisoryNode', supervisoryNodeFilter);

    function supervisoryNodeFilter() {
        return function(supervisoryNode) {
            if (supervisoryNode.facility) {
                return supervisoryNode.name + ' (' + supervisoryNode.facility.name + ')';
            }
            return supervisoryNode.name;
        };
    }

})();
