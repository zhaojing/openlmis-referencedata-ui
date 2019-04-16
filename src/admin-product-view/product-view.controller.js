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
     * @name admin-product-view.controller:ProductViewController
     *
     * @description
     * Controller for managing product  view screen.
     */
    angular
        .module('admin-product-view')
        .controller('ProductViewController', controller);

    controller.$inject = ['confirmService', 'loadingModalService', 'notificationService', '$state',
        '$q', 'alertService', 'selectProductsModalService', 'product', 'kitConstituents',
        'products', 'OrderableResource', 'FunctionDecorator'];

    function controller(confirmService, loadingModalService, notificationService, $state, $q, alertService,
                        selectProductsModalService, product, kitConstituents, products,
                        OrderableResource, FunctionDecorator) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToProductList  = goToProductList;
        vm.addKitContituents   = addKitContituents;
        vm.removeKitContituent = removeKitContituent;
        vm.save = save;

        /**
         * @ngdoc property
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name product
         * @type {Object}
         *
         * @description
         * Contains product object. 
         */
        vm.product = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name constituents
         * @type {Object}
         *
         * @description
         * Contains product's normalized children object. 
         */
        vm.constituents = undefined;

        /**
         * @ngdoc method
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ProductViewController.
         */
        function onInit() {
            vm.product = product;
            vm.constituents = normalizeChildren();
        }

        /**
         * @ngdoc method
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name addKitContituents
         *
         * @description
         * Method that displays a modal for selecting and adding a product to the UI
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
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name removeKitContituent
         *
         * @description
         * Method that removes kit constituest from the kit product
         *
         * @param {Object} a single child or kit constituent to be removed
         */
        function removeKitContituent(productKit) {
            if (vm.constituents.indexOf(productKit) > -1) {
                vm.constituents.splice(vm.constituents.indexOf(productKit), 1);
            }
        }

        /**
         * @ngdoc method
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name save
         *
         * @description
         * Method that will save a list of kit constituent parts.
         */
        function save() {
            confirmService.confirm('adminProductView.confirm').then(confirmSaveDecorated);
        }

        /**
         * @ngdoc method
         * @methodOf admin-product-view.controller:ProductViewController
         * @name goToProductList
         *
         * @description
         * Redirects to product list screen.
         */
        function goToProductList() {
            $state.go('^', {}, {
                reload: true
            });
        }

        var confirmSaveDecorated = new FunctionDecorator()
            .decorateFunction(confirmSave)
            .withSuccessNotification('adminProductView.productSavedSuccessfully')
            .withErrorNotification('adminProductView.failedToSaveProduct')
            .withLoading(true)
            .getDecoratedFunction();

        function confirmSave() {
            var productToSave = angular.copy(vm.product);
            productToSave.children = transformChildren();
            new OrderableResource().update(productToSave)
                .then(function() {
                    goToProductList();
                });
        }

        function selectProducts(availableProducts) {
            if (!availableProducts.length) {
                alertService.error(
                    'adminProductView.noProductsToAdd.label',
                    'adminProductView.noProductsToAdd.message'
                );
                return $q.reject();
            }

            return selectProductsModalService.show(availableProducts);
        }

        function excludeSelectedOrderables() {
            return products.filter(function(i) {
                return _.pluck(vm.constituents, 'id').indexOf(i.id) < 0;
            });
        }

        function transformChildren() {
            /*  convert product childern objects to the format the API expects */
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
                var foundConstituent = _.find(vm.product.children, function(product) {
                    return constituent.id === product.orderable.id;
                });
                constituent.quantity = foundConstituent.quantity;
                return constituent;
            });
        }

    }
})();
