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

describe('SupplyPartnerAddController', function() {

    beforeEach(function() {

        module('admin-supply-partner-add');

        var SupplyPartnerDataBuilder;

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            SupplyPartnerDataBuilder = $injector.get('SupplyPartnerDataBuilder');

            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');

            this.confirmService = $injector.get('confirmService');
            this.SupplyPartnerRepository = $injector.get('SupplyPartnerRepository');
            this.stateTrackerService = $injector.get('stateTrackerService');
            this.$state = $injector.get('$state');
            this.loadingModalService = $injector.get('loadingModalService');
            this.notificationService = $injector.get('notificationService');
            this.messageService = $injector.get('messageService');
        });

        this.confirmDeferred = this.$q.defer();
        this.saveDeferred = this.$q.defer();

        this.supplyPartner = new SupplyPartnerDataBuilder().build();

        var loadingDeferred = this.$q.defer();

        spyOn(this.confirmService, 'confirm').andReturn(this.confirmDeferred.promise);
        spyOn(this.stateTrackerService, 'goToPreviousState').andCallFake(loadingDeferred.resolve);
        spyOn(this.SupplyPartnerRepository.prototype, 'create').andReturn(this.saveDeferred.promise);
        spyOn(this.$state, 'go');
        spyOn(this.loadingModalService, 'open').andReturn(loadingDeferred.promise);
        spyOn(this.loadingModalService, 'close').andCallFake(loadingDeferred.resolve);
        spyOn(this.notificationService, 'success');
        spyOn(this.notificationService, 'error');
        spyOn(this.messageService, 'get').andCallFake(function(key) {
            return key;
        });

        this.vm = this.$controller('SupplyPartnerAddController');
        this.vm.$onInit();
    });

    describe('$onInit', function() {

        it('should expose supply partner', function() {
            expect(this.vm.supplyPartner).toEqual({});
        });

        it('should expose stateTrackerService.goToPreviousState method', function() {
            expect(this.vm.goToPreviousState).toBe(this.stateTrackerService.goToPreviousState);
        });

    });

    describe('save', function() {

        it('should prompt user to add associations', function() {
            this.SupplyPartnerRepository.prototype.create.andReturn(this.$q.when(this.supplyPartner));
            this.vm.save();
            this.$rootScope.$apply();

            expect(this.confirmService.confirm).toHaveBeenCalledWith(
                'adminSupplyPartnerAdd.message.doYouWantToAddAssociations',
                'adminSupplyPartnerAdd.button.yesAddAssociation',
                'adminSupplyPartnerAdd.button.no'
            );
        });

        it('should open loading modal if user refuses to add associations', function() {
            this.vm.save();

            this.confirmDeferred.reject();
            this.$rootScope.$apply();

            expect(this.loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification if supply partner was saved successfully', function() {
            this.vm.save();

            this.confirmDeferred.reject();
            this.saveDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.notificationService.success).toHaveBeenCalledWith(
                'adminSupplyPartnerAdd.message.supplyPartnerHasBeenSaved'
            );
        });

        it('should show notification if supply partner save has failed', function() {
            this.vm.save();

            this.confirmDeferred.reject();
            this.saveDeferred.reject();
            this.$rootScope.$apply();

            expect(this.notificationService.error).toHaveBeenCalledWith(
                'adminSupplyPartnerAdd.message.failedToSaveSupplyPartner'
            );
        });

        it('should take to the user to add associations page if user agrees to it', function() {
            this.SupplyPartnerRepository.prototype.create.andReturn(this.$q.when(this.supplyPartner));
            this.vm.save();

            this.confirmDeferred.resolve();
            this.$rootScope.$apply();

            expect(this.$state.go).toHaveBeenCalledWith(
                'openlmis.administration.supplyPartners.edit', {
                    id: this.supplyPartner.id
                }
            );
        });

    });

});
