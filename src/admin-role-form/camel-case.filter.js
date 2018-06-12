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
     * @name admin-role-form.filter:camelCase
     *
     * @description
     * Parses the given all caps snake case string into a camel case one.
     *
     * @param   {Object} string the string to be formatted
     * @return  {String}        the formated string
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{'ALL_CAPS_SNAKE_CASE' | camelCase}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('camelCase')('ALL_CAPS_SNAKE_CASE');
     * ```
     */
    angular
        .module('admin-role-form')
        .filter('camelCase', camelCaseFilter);

    function camelCaseFilter() {
        return function(string) {
            if (!string) {
                return undefined;
            }

            var message = '';
            angular.forEach(string.toLowerCase().split('_'), function(part, id) {
                if (id) {
                    message += part.charAt(0).toUpperCase() + part.slice(1);
                } else {
                    message += part;
                }
            });
            return message;
        };
    }

})();
