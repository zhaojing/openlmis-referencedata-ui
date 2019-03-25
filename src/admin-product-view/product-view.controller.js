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
        '$q', 'alertService', 'selectProductsModalService', 'orderableService', 'product', 'kitConstituents',
        'products'];

    function controller(confirmService, loadingModalService, notificationService, $state, $q, alertService,
                        selectProductsModalService, orderableService, product, kitConstituents, products) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToProductList  = goToProductList;
        vm.addKitContituents   = addKitContituents;
        vm.removeKitContituent = removeKitContituent;
        vm.validateQuantity = validateQuantity;
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
         * @ngdoc method
         * @propertyOf admin-product-view.controller:ProductViewController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ProductViewController.
         */
        function onInit() {
            vm.product = product;
            vm.kitConstituentsCount = product.children.length;
            normalizeChildren();
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
                    if (vm.product.children.length === 0) {
                        vm.product.children = selectedProducts;
                    } else {
                        vm.product.children.push.apply(vm.product.children, selectedProducts);
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
            if (product.children.indexOf(productKit) > -1) {
                product.children.splice(product.children.indexOf(productKit), 1);
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
            if (validateProduct()) {
                confirmService.confirm('adminProductView.confirm').then(confirmSave);
            } else {
                alertService.error('adminProductView.submitInvalid');
            }
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

        function confirmSave() {
            var loadingPromise = loadingModalService.open();
            var productToSave = angular.copy(vm.product);
            productToSave.children = transformChildren(vm.product);
            orderableService.update(productToSave).then(function() {
                loadingPromise.then(function() {
                    notificationService.success('adminProductView.productUpdatedSuccessfully');
                });
                goToProductList();
            }, function(errorResponse) {
                loadingModalService.close();
                alertService.error(errorResponse.data.message);
            });
        }

        function validateProduct() {
            _.each(vm.product.children, function(item) {
                vm.validateQuantity(item);
            });

            return _.chain(vm.product.children)
                .pluck('$errors')
                .map(function(value) {
                    return _.values(value);
                })
                .flatten()
                .contains(true)
                .value() === false;
        }

        /**
         * @ngdoc method
         * @methodOf admin-product-view.controller:ProductViewController
         * @name goToProductList
         *
         * @description
         * Redirects to product list screen.
         *
         * @param {Object} a single child or kit constituent to be validated
         */
        function validateQuantity(item) {
            item.$errors = {};
            if (item.quantity < 0 || item.quantity === undefined) {
                item.$errors.quantityInvalid = true;
            } else {
                item.$errors.quantityInvalid = false;
            }
            return item;
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
                return _.pluck(product.children, 'id').indexOf(i.id) < 0;
            });
        }

        function transformChildren(product) {
            /*  convert product childern objects to the format the API expects */
            return _.map(product.children, function(child) {
                return {
                    orderable: {
                        id: child.id
                    },
                    quantity: child.quantity
                };
            });
        }

        function normalizeChildren() {
            /* Add product's children object missing properties that comes from the API */
            vm.product.children = _.map(kitConstituents, function(constituent) {
                var foundConstituent = _.find(vm.product.children, function(product) {
                    return constituent.id === product.orderable.id;
                });
                constituent.quantity = foundConstituent.quantity;
                return constituent;
            });
        }

    }
})();
