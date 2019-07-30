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

    controller.$inject = ['programsOrderable', 'programsMap', 'canEdit', 'orderable', 'FunctionDecorator',
        'OrderableResource', '$state', 'confirmService', 'successNotificationKey', 'errorNotificationKey'];

    function controller(programsOrderable, programsMap, canEdit, orderable, FunctionDecorator, OrderableResource,
                        $state, confirmService, successNotificationKey, errorNotificationKey) {

        var vm = this;

        vm.$onInit = onInit;
        vm.removeProgramOrderable =
            new FunctionDecorator()
                .decorateFunction(removeProgramOrderable)
                .withSuccessNotification(successNotificationKey)
                .withErrorNotification(errorNotificationKey)
                .withLoading(true)
                .getDecoratedFunction();

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name programsOrderable
         * @type {Object}
         *
         * @description
         * Contains programsOrderable object. 
         */
        vm.programsOrderable = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name programsMap
         * @type {Object}
         *
         * @description
         * Contains programsMap object. 
         */
        vm.programsMap = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name canEdit
         * @type {Object}
         *
         * @description
         * Contains canEdit object. 
         */
        vm.canEdit = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditProgramsController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditProgramsController.
         */
        function onInit() {
            vm.programsOrderable = programsOrderable;
            vm.programsMap = programsMap;
            vm.canEdit = canEdit;
            vm.orderable = orderable;
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-program-edit.controller:OrderableProgramEditController
         * @name removeProgramOrderable
         *
         * @description
         * Remove the Orderable Program.
         */
        function removeProgramOrderable(programOrderable) {
            return confirmService.confirm('adminOrderableEdit.confirmToRemoveOrderableProgram').then(function() {
                vm.orderable.programs.splice(vm.programsOrderable.indexOf(programOrderable.program), 1);
                return new OrderableResource()
                    .update(vm.orderable)
                    .then(function() {
                        $state.reload();
                    });
            });
        }
    }
})();
