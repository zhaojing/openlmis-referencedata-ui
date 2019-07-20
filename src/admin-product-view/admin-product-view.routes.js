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

    angular.module('admin-product-view').config(routes);

    routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS'];

    function routes($stateProvider, ADMINISTRATION_RIGHTS) {

        $stateProvider.state('openlmis.administration.orderables.view', {
            label: 'adminProductView.orderableDetails',
            url: '/products/:id',
            accessRights: [ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE],
            views: {
                '@openlmis': {
                    controller: 'ProductViewController',
                    templateUrl: 'admin-product-view/product-view.html',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                product: function(orderableFactory, $stateParams) {
                    return orderableFactory.getOrderableWithProgramData($stateParams.id);
                },
                kitConstituents: function($stateParams, product, OrderableResource, paginationService) {
                    return paginationService.registerList(null, $stateParams, function() {
                        var ids = product.children.map(function(product) {
                            return product.orderable.id;
                        });

                        if (ids.length) {
                            return new OrderableResource().query({
                                id: ids
                            })
                                .then(function(response) {
                                    return response.content;
                                });
                        }
                        return product.children;
                    }, {
                        customPageParamName: 'kitConstituentPage',
                        customSizeParamName: 'kitConstituentSize'
                    });
                },
                products: function(OrderableResource) {
                    return new OrderableResource().query(
                        {
                            sort: 'fullProductName,asc'
                        }
                    )
                        .then(function(products) {
                            return products.content;
                        });
                }
            }
        });
    }
})();
