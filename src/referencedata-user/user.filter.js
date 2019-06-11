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
     * @name referencedata-user.filter:user
     *
     * @description
     * Parses the given user into more user-friendly string.
     *
     * @param   {String}  user            the user to be formatted
     * @return  {String}                  the formated user
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{user.name | user}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('user')(user.name);
     * ```
     */
    angular
        .module('referencedata-user')
        .filter('user', userFilter);

    function userFilter() {
        return function(user) {
            if (user) {
                return user.firstName + ' ' + user.lastName;
            }
        };
    }

})();
