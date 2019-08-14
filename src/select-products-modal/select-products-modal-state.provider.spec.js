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

describe('selectProductsModalStateProvider', function() {

    beforeEach(function() {
        var context = this;
        module('openlmis-modal-state', function(modalStateProvider, $stateProvider) {
            context.modalStateProvider = modalStateProvider;
            context.$stateProvider = $stateProvider;
        });

        module('select-products-modal', function(selectProductsModalStateProvider) {
            context.selectProductsModalStateProvider = selectProductsModalStateProvider;
        });

        inject(function($injector) {
            this.selectProductsModalService = $injector.get('selectProductsModalService');
            this.OrderableResource = $injector.get('OrderableResource');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.$state = $injector.get('$state');
        });

        this.orderables = [
            new this.OrderableDataBuilder().build(),
            new this.OrderableDataBuilder().build()
        ];

        this.orderablesPage = new this.PageDataBuilder()
            .withContent(this.orderables)
            .build();

        spyOn(this.OrderableResource.prototype, 'query').andReturn(this.$q.resolve(this.orderablesPage));
        spyOn(this.selectProductsModalService, 'getOrderables').andReturn();
        spyOn(this.selectProductsModalService, 'getSelections').andReturn({});

        this.goToState = function() {
            this.$state.go.apply(this, arguments);
            this.$rootScope.$apply();
        };

        this.getResolvedValue = function(name) {
            return this.$state.$current.locals.globals[name];
        };
    });

    describe('stateWithAddOrderablesChildState', function() {

        beforeEach(function() {
            spyOn(this.modalStateProvider, 'state').andReturn();
            spyOn(this.$stateProvider, 'state').andReturn();
        });

        it('should register the state as page if no display is defined', function() {
            this.selectProductsModalStateProvider.stateWithAddOrderablesChildState('main', {
                url: '/main'
            });

            expect(this.$stateProvider.state).toHaveBeenCalledWith('main', {
                url: '/main'
            });
        });

        it('should register the state as modal if display is set to modal', function() {
            this.selectProductsModalStateProvider.stateWithAddOrderablesChildState('mainModal', {
                url: '/mainModal',
                display: 'modal'
            });

            expect(this.modalStateProvider.state).toHaveBeenCalledWith('mainModal', {
                url: '/mainModal',
                display: 'modal'
            });
        });

    });

    describe('.addOrderables', function() {

        beforeEach(function() {
            this.selectProductsModalStateProvider.stateWithAddOrderablesChildState('main', {
                url: '/main'
            });
        });

        it('should resolve orderables', function() {
            this.selectProductsModalService.getOrderables.andReturn(this.orderables);

            this.goToState('main.addOrderables');

            expect(this.getResolvedValue('orderables')).toEqual(this.orderables);
            expect(this.OrderableResource.prototype.query).not.toHaveBeenCalled();
        });

        it('should resolve orderables for external pagination', function() {
            this.searchText = 'some search text';

            this.goToState('main.addOrderables', {
                addOrderablesPage: 1,
                addOrderablesSize: 20,
                search: this.searchText
            });

            expect(this.getResolvedValue('orderables')).toEqual(this.orderables);
            expect(this.OrderableResource.prototype.query).toHaveBeenCalledWith({
                sort: 'fullProductName,asc',
                page: 1,
                size: 20,
                search: this.searchText
            });
        });

        it('should resolve external to false if local pagination is used', function() {
            this.selectProductsModalService.getOrderables.andReturn(this.orderables);

            this.goToState('main.addOrderables');

            expect(this.getResolvedValue('external')).toEqual(false);
        });

        it('should resolve external to true if external pagination is used', function() {
            this.goToState('main.addOrderables');

            expect(this.getResolvedValue('external')).toEqual(true);
        });

    });

});
