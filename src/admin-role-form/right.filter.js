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
     * @name admin-role-form.filter:right
     *
     * @description
     * Parses the given right name into more user-friendly string.
     *
     * @param   {Object} rightName the right name to be formatted
     * @return  {String}           the formated right name
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{right.name | right}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('right')(right.name);
     * ```
     */
    angular
        .module('admin-role-form')
        .filter('right', roleRightFilter);

    roleRightFilter.$inject = ['messageService', '$filter'];

    function roleRightFilter(messageService, $filter) {
        return function(rightName) {
            if (!rightName) {
                return undefined;
            }
            return messageService.get('adminRoleForm.' + $filter('camelCase')(rightName));
        };
    }

})();
