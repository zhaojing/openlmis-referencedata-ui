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

describe('SelectProductsModalController', function() {

    beforeEach(function() {
        module('select-products-modal');

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$controller = $injector.get('$controller');
            this.alertService = $injector.get('alertService');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.selectProductsModalService = $injector.get('selectProductsModalService');
            this.$state = $injector.get('$state');
        });

        this.external = false;

        this.orderables = [
            new this.OrderableDataBuilder()
                .withFullProductName('Product One')
                .withProductCode('PC1')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Product Two pc2')
                .withProductCode('PS1')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Product Three')
                .withProductCode('XB1')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Product Four')
                .withProductCode('N64')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('undefined')
                .withProductCode('undefined')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Counter Something')
                .withProductCode('Co1')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Another product')
                .withProductCode('Code Name')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Some Product')
                .withProductCode('CD1')
                .build(),
            new this.OrderableDataBuilder()
                .withFullProductName('Same Product to displayed')
                .withoutProductCode()
                .build()
        ];

        this.selections = {};
        this.selections[this.orderables[0].id] = this.orderables[0];
        this.$stateParams = {};

        spyOn(this.$state, 'go');
        spyOn(this.selectProductsModalService, 'getSelections').andReturn(this.selections);

        this.initController = function() {
            this.vm = this.$controller('SelectProductsModalController', {
                modalDeferred: this.modalDeferred,
                orderables: this.orderables,
                external: this.external,
                $stateParams: this.$stateParams
            });
            this.vm.$onInit();
        };
    });

    describe('$onInit', function() {

        it('should expose orderables', function() {
            this.initController();

            expect(this.vm.orderables).toEqual(this.orderables);
        });

        it('should expose code', function() {
            this.$stateParams.productCode = 'C100';
            this.initController();

            expect(this.vm.code).toEqual(this.$stateParams.productCode);
        });

        it('should expose name', function() {
            this.$stateParams.productName = 'Product';
            this.initController();

            expect(this.vm.name).toEqual(this.$stateParams.productName);
        });

        it('should expose this.selectProductsModalService.reject method', function() {
            this.initController();

            expect(this.vm.close).toBe(this.selectProductsModalService.reject);
        });

        it('should expose this.selectProductsModalService.resolve method', function() {
            this.initController();

            expect(this.vm.selectProducts).toBe(this.selectProductsModalService.resolve);
        });

        it('should initialize selection object', function() {
            this.initController();

            expect(this.vm.selections).toEqual(this.selections);
        });

    });

    describe('search', function() {

        it('should reload the state', function() {
            this.initController();

            this.vm.code = 'C100';
            this.vm.name = 'Levora';

            this.vm.search();

            expect(this.$state.go).toHaveBeenCalledWith('.', {
                productCode: 'C100',
                productName: 'Levora'
            }, {
                reload: '',
                notify: false
            });
        });

    });

});
