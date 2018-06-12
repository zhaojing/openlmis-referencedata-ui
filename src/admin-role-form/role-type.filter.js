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
     * @name admin-role-form.filter:roleType
     *
     * @description
     * Parses the given role type name into more user-friendly string.
     *
     * @param   {String}  roleType        the role type name to be formatted
     * @param   {boolean} showDescription flag defining whether description should be shown instead of the label
     * @return  {String}                  the formated role type name or description
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{roleType.name | roleType:true}}</td>
     * ```
     * In the JS:
     * ```
     * // for label
     * $filter('roleType')(roleType.name);
     * 
     * // for description
     * $filter('roleType')(roleType.name, true);
     * ```
     */
    angular
        .module('admin-role-form')
        .filter('roleType', roleRightFilter);

    roleRightFilter.$inject = ['messageService', '$filter', 'ROLE_TYPES'];

    function roleRightFilter(messageService, $filter, ROLE_TYPES) {
        return function(roleType, showDescription) {
            var label = ROLE_TYPES.getLabel(roleType);

            if (showDescription) {
                return messageService.get('adminRoleForm.' + $filter('camelCase')(roleType) + 'Description');
            }

            return messageService.get(label);
        };
    }

})();
