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
     * @name admin-orderable-edit.controller:OrderableEditController
     *
     * @description
     * Controller for managing orderable view screen.
     */
    angular
        .module('admin-orderable-edit')
        .controller('OrderableEditController', controller);

    controller.$inject = ['confirmService', 'loadingModalService', 'notificationService', '$state',
        '$q', 'alertService', 'selectProductsModalService', 'orderable', 'kitConstituents',
        'orderables', 'OrderableResource'];

    function controller(confirmService, loadingModalService, notificationService, $state, $q, alertService,
                        selectProductsModalService, orderable, kitConstituents, orderables,
                        OrderableResource) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToProductList  = goToProductList;
        vm.addKitContituents   = addKitContituents;
        vm.removeKitContituent = removeKitContituent;
        vm.save = save;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditController
         * @name orderable
         * @type {Object}
         *
         * @description
         * Contains orderable object. 
         */
        vm.orderable = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-orderable-edit.controller:OrderableEditController
         * @name constituents
         * @type {Object}
         *
         * @description
         * Contains orderable's normalized children object. 
         */
        vm.constituents = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating OrderableEditController.
         */
        function onInit() {
            vm.orderable = orderable;
            vm.constituents = normalizeChildren();
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditController
         * @name addKitContituents
         *
         * @description
         * Method that displays a modal for selecting and adding a orderable to the UI
         */
        function addKitContituents() {
            selectProducts(excludeSelectedOrderables()).
                then(function(selectedProducts) {
                    if (vm.constituents.length === 0) {
                        vm.constituents = selectedProducts;
                    } else {
                        vm.constituents.push.apply(vm.constituents, angular.copy(selectedProducts));
                    }
                });
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditController
         * @name removeKitContituent
         *
         * @description
         * Method that removes kit constituest from the kit orderable
         *
         * @param {Object} a single child or kit constituent to be removed
         */
        function removeKitContituent(orderableKit) {
            if (vm.constituents.indexOf(orderableKit) > -1) {
                vm.constituents.splice(vm.constituents.indexOf(orderableKit), 1);
            }
        }

        /**
         * @ngdoc method
         * @propertyOf admin-orderable-edit.controller:OrderableEditController
         * @name save
         *
         * @description
         * Method that will save a list of kit constituent parts.
         */
        function save() {
            confirmService.confirm('adminOrderableEdit.confirm').then(confirmSave);
        }

        /**
         * @ngdoc method
         * @methodOf admin-orderable-edit.controller:OrderableEditController
         * @name goToProductList
         *
         * @description
         * Redirects to orderable list screen.
         */
        function goToProductList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        function confirmSave() {
            var loadingPromise = loadingModalService.open();
            var orderableToSave = angular.copy(vm.orderable);
            orderableToSave.children = transformChildren();
            new OrderableResource().update(orderableToSave)
                .then(function() {
                    loadingPromise.then(function() {
                        notificationService.success('adminOrderableEdit.orderableSavedSuccessfully');
                    });
                    goToProductList();
                }, function() {
                    loadingModalService.close();
                    alertService.error('adminOrderableEdit.failedToSaveProduct');
                });
        }

        function selectProducts(availableProducts) {
            if (!availableProducts.length) {
                alertService.error(
                    'adminOrderableEdit.noProductsToAdd.label',
                    'adminOrderableEdit.noProductsToAdd.message'
                );
                return $q.reject();
            }

            return selectProductsModalService.show(availableProducts);
        }

        function excludeSelectedOrderables() {
            return orderables.filter(function(i) {
                return _.pluck(vm.constituents, 'id').indexOf(i.id) < 0;
            });
        }

        function transformChildren() {
            /*  convert orderable childern objects to the format the API expects */
            return vm.constituents.map(function(child) {
                return {
                    orderable: {
                        id: child.id
                    },
                    quantity: child.quantity
                };
            });
        }

        function normalizeChildren() {
            return kitConstituents.map(function(constituent) {
                var foundConstituent = _.find(vm.orderable.children, function(orderable) {
                    return constituent.id === orderable.orderable.id;
                });
                constituent.quantity = foundConstituent.quantity;
                return constituent;
            });
        }

    }
})();
