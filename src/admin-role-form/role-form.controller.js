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
     * @ngdoc controller
     * @name admin-role-form.controller:RoleFormController
     *
     * @description
     * Manages role form allowing for role creation and modification.
     */
    angular
        .module('admin-role-form')
        .controller('RoleFormController', controller);

    controller.$inject = ['role'];

    function controller(role) {
        var vm = this;

        vm.$onInit = onInit;

        /**
         * @ngdoc property
         * @propertyOf admin-role-form.controller:RoleFormController
         * @type {Object}
         * @name role
         *
         * @description
         * The role that is being created/modified.
         */
        vm.role = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-role-form.controller:RoleFormController
         * @name $onInit
         *
         * @description
         * Initialization method fired after the controller has been created.
         */
        function onInit() {
            vm.role = role;
        }
    }

})();
