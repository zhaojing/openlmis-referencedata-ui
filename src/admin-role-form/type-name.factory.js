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
     * @name admin-role-form.typeNameFactory
     *
     * @description
     * Provides method for retrieving labels and description based on the right name.
     */
    angular
        .module('admin-role-form')
        .factory('typeNameFactory', typeNameFactory);

    typeNameFactory.$inject = ['messageService'];

    function typeNameFactory(messageService) {
        var factory = {
            getLabel: getLabel,
            getDescription: getDescription
        };
        return factory;

        /**
         * @ngdoc method
         * @methodOf admin-role-form.typeNameFactory
         * @name getLabel
         *
         * @description
         * Returns a label based on the given type.
         *
         * @param   {String}    type    the type to parse
         * @return  {String}            the localized label
         */
        function getLabel(type) {
            return messageService.get('adminRoleForm.' + toCamelCase(type) + '.label');
        }

        /**
         * @ngdoc method
         * @methodOf admin-role-form.typeNameFactory
         * @name getDescription
         *
         * @description
         * Return a localized description for the given type.
         *
         * @param   {String}    type    the type to parse
         * @return  {String}            the localized description
         */
        function getDescription(type) {
            return messageService.get('adminRoleForm.' + toCamelCase(type) + '.description');
        }

        function toCamelCase(string) {
            var message = '';

            angular.forEach(string.toLowerCase().split('_'), function(part, id) {
                if (id) {
                    message += part.charAt(0).toUpperCase() + part.slice(1);
                } else {
                    message += part;
                }
            });

            return message;
        }
    }

})();
