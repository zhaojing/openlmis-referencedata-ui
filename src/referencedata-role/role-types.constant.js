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
     * @ngdoc object
     * @name referencedata-role.ROLE_TYPES
     *
     * @description
     * This is constant for role types.
     */
    angular
        .module('referencedata-role')
        .constant('ROLE_TYPES', types());

    function types() {
        var ROLE_TYPES = {
            SUPERVISION: 'SUPERVISION',
            ORDER_FULFILLMENT: 'ORDER_FULFILLMENT',
            REPORTS: 'REPORTS',
            GENERAL_ADMIN: 'GENERAL_ADMIN',
            getLabel: getLabel,
            getRoleTypes: getRoleTypes
        },
        labels = {
            SUPERVISION: 'referencedataRoles.supervision',
            ORDER_FULFILLMENT: 'referencedataRoles.fulfillment',
            REPORTS: 'referencedataRoles.reports',
            GENERAL_ADMIN: 'referencedataRoles.administration'
        };

        return ROLE_TYPES;

        /**
         * @ngdoc method
         * @methodOf referencedata-role.ROLE_TYPES
         * @name getLabel
         *
         * @description
         * Returns a label for the given role type. Throws an exception if the status is not recognized.
         *
         * @param  {String} role the role name
         * @return {String}      the label
         */
        function getLabel(role) {
            var label = labels[role];

            if (!label) {
                throw '"' + role + '" is not a valid role type';
            }

            return label;
        }

        /**
         * @ngdoc method
         * @methodOf referencedata-role.ROLE_TYPES
         * @name getTypes
         *
         * @description
         * Returns all available role types as a list.
         *
         * @return {Array} the list of available role types
         */
        function getRoleTypes() {
            return [
                ROLE_TYPES.SUPERVISION,
                ROLE_TYPES.ORDER_FULFILLMENT,
                ROLE_TYPES.REPORTS,
                ROLE_TYPES.GENERAL_ADMIN
            ];
        }
    }

})();
