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
     * @name openlmis-user.filter:notificationTag
     *
     * @description
     * Parses the given notification tag into more user-friendly string.
     *
     * @param   {Object} notificationTag  the notification tag to be formatted
     * @return  {String}                  the formated notification tag
     *
     * @example
     * In the HTML:
     * ```
     * <td>{{notificationTag | notificationTag}}</td>
     * ```
     * In the JS:
     * ```
     * $filter('notificationTag')(notificationTag);
     * ```
     */
    angular
        .module('openlmis-user')
        .filter('notificationTag', notificationTagFilter);

    function notificationTagFilter() {
        return function(notificationTag) {
            var split = notificationTag.split('-'),
                moduleName = split[0],
                notificationType = split[1] ? split[1] : undefined;

            var formatted = toStartCase(moduleName);

            if (notificationType) {
                formatted = [formatted, toStartCase(notificationType)].join(' - ');
            }

            return formatted;
        };

        function toStartCase(string) {
            return string
                .split(/(?=[A-Z])/)
                .map(function(word, id) {
                    if (id === 0) {
                        return word.charAt(0).toUpperCase() + word.slice(1);
                    }
                    return word;
                })
                .join(' ');
        }
    }

})();
