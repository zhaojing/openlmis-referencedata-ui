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

describe('OrderableEditGeneralController', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.confirmService = $injector.get('confirmService');
            this.$state = $injector.get('$state');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
        });

        this.orderable = new this.OrderableDataBuilder().buildJson();

        spyOn(this.$state, 'go');
        spyOn(this.OrderableResource.prototype, 'update').andReturn(this.$q.resolve(this.orderable));

        this.vm = this.$controller('OrderableEditGeneralController', {
            orderable: this.orderable
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });
    });

    describe('goToOrderableList', function() {

        it('should call state go with correct params', function() {
            this.vm.goToOrderableList();

            expect(this.$state.go).toHaveBeenCalledWith('^.^', {}, {
                reload: true
            });
        });
    });

    describe('saveOrderable', function() {

        it('should save orderable', function() {
            this.vm.saveOrderable();

            expect(this.OrderableResource.prototype.update).toHaveBeenCalledWith(this.orderable);
        });

        it('should redirect to the list view on success', function() {
            this.vm.saveOrderable();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith('^.^', {}, {
                reload: true
            });
        });

        it('should not redirect to the list view on failure', function() {
            this.OrderableResource.prototype.update.andReturn(this.$q.reject());

            this.vm.saveOrderable();
            this.$rootScope.$apply();

            expect(this.$state.go).not.toHaveBeenCalled();
        });

    });
});