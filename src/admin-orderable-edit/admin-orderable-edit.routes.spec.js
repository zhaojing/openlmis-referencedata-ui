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

describe('openlmis.administration.orderables.edit.route', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            var programService = jasmine.createSpyObj('orderableService', ['getAll']);
            $provide.service('programService', function() {
                return programService;
            });
        });

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$state = $injector.get('$state');
            this.$location = $injector.get('$location');
            this.$rootScope = $injector.get('$rootScope');
            this.$templateCache = $injector.get('$templateCache');
            this.orderableFactory = $injector.get('orderableFactory');
            this.OrderableResource = $injector.get('OrderableResource');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.paginationService = $injector.get('paginationService');
            this.OrderableChildrenDataBuilder = $injector.get('OrderableChildrenDataBuilder');
            this.ADMINISTRATION_RIGHTS = $injector.get('ADMINISTRATION_RIGHTS');
        });

        var productChildren = [
            new this.OrderableChildrenDataBuilder().withId('child_product_1_id')
                .withQuantity(30)
                .buildJson(),
            new this.OrderableChildrenDataBuilder().withId('child_product_2_id')
                .withQuantity(40)
                .buildJson()
        ];

        this.kitConstituents = [
            new this.OrderableDataBuilder()
                .withId('child_product_1_id')
                .withFullProductName('p1')
                .buildJson(),
            new this.OrderableDataBuilder()
                .withId('child_product_2_id')
                .withFullProductName('p2')
                .buildJson(),
            new this.OrderableDataBuilder()
                .withId('child_product_3_id')
                .withFullProductName('p3')
                .buildJson()
        ];

        this.orderable = new this.OrderableDataBuilder()
            .withId('product_1_id')
            .withFullProductName('p1')
            .withChildren(productChildren)
            .buildJson();

        this.productWithNoChildren = new this.OrderableDataBuilder()
            .withId('product_1_id')
            .withFullProductName('p1')
            .buildJson();

        spyOn(this.orderableFactory, 'getOrderableWithProgramData')
            .andReturn(this.$q.resolve(this.orderable));
        spyOn(this.OrderableResource.prototype, 'query').andReturn(this.$q.resolve(
            new this.PageDataBuilder()
                .withContent(this.kitConstituents)
                .build()
        ));
        spyOn(this.$templateCache, 'get').andCallThrough();

        this.state = this.$state.get('openlmis.administration.orderables.edit');
    });

    describe('state', function() {

        it('should resolve orderable', function() {
            var result;

            this.state.resolve.orderable(this.orderableFactory, this.$state).then(function(orderable) {
                result = orderable;
            });

            this.$rootScope.$apply();

            expect(result).toEqual(this.orderable);
        });

        it('should resolve kitConstituents', function() {
            var result;

            this.state.resolve.kitConstituents(this.$state, this.orderable, this.OrderableResource,
                this.paginationService)
                .then(function(kitsConstituents) {
                    result = kitsConstituents;
                });

            this.$rootScope.$apply();

            expect(result).toEqual(this.kitConstituents);
        });

        it('should resolve kitConstituents to emptry Array if orderable does not have children', function() {
            var result;

            this.state.resolve.kitConstituents(this.$state, this.productWithNoChildren, this.OrderableResource,
                this.paginationService)

                .then(function(kitsConstituents) {
                    result = kitsConstituents;
                });

            this.$rootScope.$apply();

            expect(result).toEqual([]);
        });

        it('should expose controller as vm', function() {
            expect(this.state.accessRights).toEqual([this.ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE]);
        });
    });
});