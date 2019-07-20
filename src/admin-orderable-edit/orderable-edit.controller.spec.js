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

describe('OrderableEditController', function() {

    beforeEach(function() {
        module('admin-orderable-edit');

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.confirmService =  $injector.get('confirmService');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService =  $injector.get('notificationService');
            this.$state = $injector.get('$state');
            this.$q = $injector.get('$q');
            this.alertService =  $injector.get('alertService');
            this.selectProductsModalService =  $injector.get('selectProductsModalService');
            this.OrderableResource =  $injector.get('OrderableResource');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.OrderableChildrenDataBuilder = $injector.get('OrderableChildrenDataBuilder');
            this.$rootScope = $injector.get('$rootScope');
        });

        var orderableChildren = [
            new this.OrderableChildrenDataBuilder().withId('child_orderable_1_id')
                .withQuantity(30)
                .buildJson(),
            new this.OrderableChildrenDataBuilder().withId('child_orderable_2_id')
                .withQuantity(40)
                .buildJson()
        ];

        this.orderable = new this.OrderableDataBuilder().withId('orderable1_id')
            .withChildren(orderableChildren)
            .buildJson();

        this.kitConstituents = [
            new this.OrderableDataBuilder()
                .withId('child_orderable_1_id')
                .withFullProductName('p1')
                .buildJson(),
            new this.OrderableDataBuilder()
                .withId('child_orderable_2_id')
                .withFullProductName('p2')
                .buildJson()
        ];

        this.orderablesToSelect = [
            new this.OrderableDataBuilder()
                .withId('child_orderable_3_id')
                .withFullProductName('p3')
                .buildJson(),
            new this.OrderableDataBuilder()
                .withId('child_orderable_4_id')
                .withFullProductName('p4')
                .buildJson()
        ];

        this.loadingDeferred = this.$q.defer();
        this.confirmDeferred = this.$q.defer();
        this.saveDeferred = this.$q.defer();

        spyOn(this.loadingModalService, 'open').andReturn(this.loadingDeferred.promise);
        spyOn(this.loadingModalService, 'close').andCallFake(this.loadingDeferred.resolve);
        spyOn(this.selectProductsModalService, 'show');
        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
        spyOn(this.OrderableResource.prototype, 'update').andReturn(this.saveDeferred.promise);
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.alertService, 'error').andCallFake();

        this.vm = this.$controller('OrderableEditController', {
            orderable: this.orderable,
            kitConstituents: this.kitConstituents,
            orderables: this.orderablesToSelect
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose goProductList method', function() {
            expect(angular.isFunction(this.vm.goToProductList)).toBe(true);
        });

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });

        it('should update or normalize children properties from kitConstituents reference', function() {
            expect(this.vm.constituents.pop()).toEqual(this.kitConstituents[1]);
        });
    });

    describe('goToProductList', function() {

        beforeEach(function() {
            spyOn(this.$state, 'go').andReturn();
            this.vm.goToProductList();
        });

        it('should call state go with correct params', function() {
            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });
    });

    describe('AddKitContituents', function() {
        beforeEach(function() {
            this.selectProductsModalService.show.andReturn(this.$q.resolve(this.orderablesToSelect));
        });

        it('should open select orderables modal', function() {
            this.vm.addKitContituents();

            expect(this.selectProductsModalService.show).toHaveBeenCalled();
        });

        it('should add all orderables to the list', function() {
            this.vm.addKitContituents();
            this.$rootScope.$apply();

            expect(this.vm.constituents.pop()).toEqual(this.orderablesToSelect[1]);
            expect(this.vm.constituents.pop()).toEqual(this.orderablesToSelect[0]);
        });

        it('should exclude selected/children ordereables from the modal', function() {
            this.vm.constituents.push(this.orderablesToSelect[0]);
            this.vm.addKitContituents();

            expect(this.selectProductsModalService.show).toHaveBeenCalledWith([this.orderablesToSelect[1]]);
        });

        it('should do nothing if user closes the select orderables modal', function() {
            this.selectProductsModalService.show.andReturn(this.$q.reject());

            var originalCount = this.vm.constituents.length;

            this.vm.addKitContituents();
            this.$rootScope.$apply();

            expect(this.vm.constituents.length).toEqual(originalCount);
        });
    });

    describe('RemoveKitContituent', function() {
        it('should remove kit constituent (child) from a orderable', function() {
            this.vm.removeKitContituent(this.kitConstituents[0]);
            this.$rootScope.$apply();

            expect(this.vm.constituents.length).toEqual(1);
            expect(this.vm.constituents.pop()).toEqual(this.kitConstituents[1]);
        });

        it('should should not remove invalid kit constituent from a orderable', function() {
            var nonExistantProduct = new this.OrderableDataBuilder().build();
            this.vm.removeKitContituent(nonExistantProduct);
            this.$rootScope.$apply();

            expect(this.vm.constituents.length).toEqual(2);
        });
    });

    describe('save', function() {
        it('should show confirmation while saving', function() {
            this.vm.save();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm).toHaveBeenCalledWith('adminOrderableEdit.confirm');
        });

        it('should save kit orderable constituents', function() {
            this.OrderableResource.prototype.update.andReturn(this.$q.when(this.orderable));
            spyOn(this.$state, 'go').andReturn();

            this.vm.save();

            this.confirmDeferred.resolve();
            this.saveDeferred.resolve();
            this.loadingDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });

            expect(this.notificationService.success).toHaveBeenCalledWith(
                'adminOrderableEdit.orderableSavedSuccessfully'
            );

        });

        it('should show error alert wen orderable save fails', function() {
            this.vm.save();

            this.confirmDeferred.resolve();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.loadingModalService.close).toHaveBeenCalled();
            expect(this.alertService.error).toHaveBeenCalledWith('adminOrderableEdit.failedToSaveProduct');
        });
    });
});