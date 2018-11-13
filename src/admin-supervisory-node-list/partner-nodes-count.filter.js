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
     * @name admin-supervisory-node-list.filter:partnerNodesCount
     *
     * @description
     * Returns a message how many partner nodes there is based on the given list.
     *
     * @param   {Array}  partnerNodes  the list of the partner nodes
     * @return  {string}               the message telling how many partner nodes there is in the list
     *
     * @example
     * We want to display how many partner nodes there is in a given list in human-readable way:
     * ```
     * <td>{{partnerNodes | partnerNodesCount}}</td>
     * ```
     */
    angular
        .module('admin-supervisory-node-list')
        .filter('partnerNodesCount', partnerNodesCountFilter);

    partnerNodesCountFilter.$inject = ['messageService'];

    function partnerNodesCountFilter(messageService) {
        return function(partnerNodes) {
            if (!partnerNodes || !partnerNodes.length) {
                return messageService.get('adminSupervisoryNodeList.noPartnerNodes');
            }

            if (partnerNodes.length === 1) {
                return messageService.get('adminSupervisoryNodeList.singlePartnerNode');
            }

            return messageService.get('adminSupervisoryNodeList.partnerNodesCount', {
                count: partnerNodes.length
            });
        };
    }

})();
