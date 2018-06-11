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
     * @param   {Object} roleType        the role type name to be formatted
     * @param   {Object} showDescription flag defining whether description should be shown instead of the label
     * @return  {String}                 the formated role type name or description
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

    roleRightFilter.$inject = ['messageService', '$filter'];

    function roleRightFilter(messageService, $filter) {
        return function(roleType, showDescription) {
            if (!roleType) {
                return undefined;
            }
            var key = 'adminRoleForm.' + $filter('camelCase')(roleType) + '.';
            if (showDescription) {
                key += 'description';
            } else {
                key += 'label';
            }

            return messageService.get(key);
        };
    }

})();
