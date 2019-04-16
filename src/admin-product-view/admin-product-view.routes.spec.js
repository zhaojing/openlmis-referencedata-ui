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

describe('openlmis.administration.product.view.route', function() {

    beforeEach(function() {
        module('admin-product-view', function($provide) {
            var programServiceMock = jasmine.createSpyObj('orderableService', ['getAll']);
            $provide.service('programService', function() {
                return programServiceMock;
            });
        });
        module('admin-product-list');

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
            this.orderableService = $injector.get('orderableService');
            this.programService = $injector.get('programService');
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

        this.product = new this.OrderableDataBuilder()
            .withId('product_1_id')
            .withFullProductName('p1')
            .withChildren(productChildren)
            .buildJson();

        this.productWithNoChildren = new this.OrderableDataBuilder()
            .withId('product_1_id')
            .withFullProductName('p1')
            .buildJson();

        this.kitConstituentsPage = new this.PageDataBuilder()
            .withContent(this.kitConstituents)
            .build();

        spyOn(this.orderableFactory, 'getOrderableWithProgramData')
            .andReturn(this.$q.resolve(this.product));
        spyOn(this.OrderableResource.prototype, 'query').andReturn(
            this.$q.resolve(this.kitConstituentsPage)
        );
        spyOn(this.$templateCache, 'get').andCallThrough();
        spyOn(this.orderableService, 'search').andReturn(this.$q.resolve());

        this.state = this.$state.get('openlmis.administration.products.view');

        this.goToUrl = goToUrl;
        this.getResolvedValue = getResolvedValue;
    });

    describe('state', function() {

        it('should go to product detail page', function() {
            this.goToUrl('administration/products/products/2');

            expect(this.$state.current.name).toEqual('openlmis.administration.products.view');
        });

        it('should resolve kitConstituents', function() {
            this.goToUrl('administration/products/products/2');

            expect(this.getResolvedValue('kitConstituents')).toEqual(this.kitConstituents);
        });

        it('should resolve product', function() {
            this.goToUrl('administration/products/products/2');

            expect(this.getResolvedValue('product')).toEqual(this.product);
        });

        it('should resolve products', function() {
            this.goToUrl('administration/products/products/2');

            expect(this.getResolvedValue('products')).toEqual(this.kitConstituents);
        });

        it('should resolve kitConstituents to emptry Array if product does not have children', function() {
            this.orderableFactory.getOrderableWithProgramData.andReturn(this.productWithNoChildren);

            this.goToUrl('administration/products/products/2');

            expect(this.getResolvedValue('kitConstituents')).toEqual([]);
        });

        it('should be accessed by user with role ORDERABLES_MANAGE', function() {
            expect(this.state.accessRights).toEqual([this.ADMINISTRATION_RIGHTS.ORDERABLES_MANAGE]);
        });
    });

    function getResolvedValue(name) {
        return this.$state.$current.locals.globals[name];
    }

    function goToUrl(url) {
        this.$location.url(url);
        this.$rootScope.$apply();
    }
});