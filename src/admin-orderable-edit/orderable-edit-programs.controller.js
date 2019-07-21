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
     * @name admin-orderable-edit.controller:OrderableEditProgramsController
     *
     * @description
     * Controller for managing orderable view screen.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditProgramsController', controller);

    controller.$inject = ['orderable', 'programsMap', '$state'];

    function controller(orderable, programsMap, $state) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToOrderableList = goToOrderableList;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name orderable
         * @type {Object}
         *
         * @description
         * Contains orderable object. 
         */
        vm.orderable = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditProgramsController.
         */
        function onInit() {
            vm.orderable = orderable;
            vm.programsMap = programsMap;
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name goToOrderableList
         *
         * @description
         * Redirects to orderable list screen.
         */
        function goToOrderableList() {
            $state.go('^.^', {}, {
                reload: true
            });
        }

    }
})();
