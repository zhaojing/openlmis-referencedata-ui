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
     * @name admin-user-form.USER_PASSWORD_OPTIONS
     *
     * @description
     * This is constant for user password modal.
     */
    angular
        .module('admin-user-form')
        .constant('USER_PASSWORD_OPTIONS', options());

    function options() {
        var USER_PASSWORD_OPTIONS = {
            SEND_EMAIL: 'SEND_EMAIL',
            RESET_PASSWORD: 'RESET_PASSWORD',
            getLabel: getLabel,
            getOptions: getOptions
        },
        labels = {
            SEND_EMAIL: 'adminUserForm.sendResetEmail',
            RESET_PASSWORD: 'adminUserForm.resetPassword'
        };

        return USER_PASSWORD_OPTIONS;

        /**
         * @ngdoc method
         * @methodOf admin-user-form.USER_PASSWORD_OPTIONS
         * @name getLabel
         *
         * @description
         * Returns a label for the given option. Throws an exception if the option is not recognized.
         *
         * @param  {String} option the option name
         * @return {String}      the label
         */
        function getLabel(option) {
            var label = labels[option];

            if (!label) {
                throw '"' + option + '" is not a valid option';
            }

            return label;
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form.USER_PASSWORD_OPTIONS
         * @name getOptions
         *
         * @description
         * Returns all available options as a list.
         *
         * @return {Array} the list of available options
         */
        function getOptions() {
            return [
                USER_PASSWORD_OPTIONS.SEND_EMAIL,
                USER_PASSWORD_OPTIONS.RESET_PASSWORD
            ];
        }
    }

})();
