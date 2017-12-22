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

describe('ServiceAccountListController', function () {

    var $q, $rootScope, $state, $controller, serviceAccountService, confirmService, loadingModalService, notificationService, messageService, ServiceAccountBuilder,
        vm, serviceAccounts;

    beforeEach(function() {

        module('admin-service-account-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            confirmService = $injector.get('confirmService');
            notificationService = $injector.get('notificationService');
            loadingModalService = $injector.get('loadingModalService');
            messageService = $injector.get('messageService');
            serviceAccountService = $injector.get('serviceAccountService');
            ServiceAccountBuilder = $injector.get('ServiceAccountBuilder');
        });

        serviceAccounts = [
            new ServiceAccountBuilder().build(),
            new ServiceAccountBuilder().build()
        ];

        vm = $controller('ServiceAccountListController', {
            serviceAccounts: serviceAccounts
        });
        vm.$onInit();

        spyOn($state, 'reload').andReturn();
        spyOn(confirmService, 'confirm').andReturn($q.resolve());
        spyOn(loadingModalService, 'open').andReturn($q.resolve());
        spyOn(loadingModalService, 'close').andReturn($q.resolve());
        spyOn(serviceAccountService, 'create').andReturn($q.resolve(serviceAccounts[0]));
        spyOn(serviceAccountService, 'remove').andReturn($q.resolve());
        spyOn(notificationService, 'success').andReturn($q.resolve());
        spyOn(notificationService, 'error').andReturn($q.resolve());
        spyOn(messageService, 'get').andCallFake(function(key) {
            return key;
        });
    });

    describe('onInit', function() {

        it('should expose serviceAccounts', function() {
            expect(vm.serviceAccounts).toEqual(serviceAccounts);
        });
    });

    describe('add', function() {

        it('should create a service account and display success notification', function() {
            vm.add();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminServiceAccount.add.question', 'adminServiceAccount.add');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(serviceAccountService.create).toHaveBeenCalled();
            expect(notificationService.success).toHaveBeenCalledWith('adminServiceAccount.add.success');
            expect($state.reload).toHaveBeenCalled();
        });

        it('should not call any service when confirmation fails', function() {
            confirmService.confirm.andReturn($q.reject());

            vm.add();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminServiceAccount.add.question', 'adminServiceAccount.add');
            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(serviceAccountService.create).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalledWith();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should display error notification when service account creation fails', function() {
            serviceAccountService.create.andReturn($q.reject());

            vm.add();
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminServiceAccount.add.question', 'adminServiceAccount.add');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(serviceAccountService.create).toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('adminServiceAccount.add.failure');
            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });
    });

    describe('remove', function() {

        it('should remove service account and display success notification', function() {
            vm.remove('token');
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminServiceAccount.delete.question', 'adminServiceAccount.delete');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(serviceAccountService.remove).toHaveBeenCalledWith('token');
            expect(notificationService.success).toHaveBeenCalledWith('adminServiceAccount.delete.success');
            expect($state.reload).toHaveBeenCalled();
        });

        it('should not call any service when confirmation fails', function() {
            confirmService.confirm.andReturn($q.reject());

            vm.remove('token');
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminServiceAccount.delete.question', 'adminServiceAccount.delete');
            expect(loadingModalService.open).not.toHaveBeenCalled();
            expect(serviceAccountService.remove).not.toHaveBeenCalled();
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).not.toHaveBeenCalledWith();
            expect($state.reload).not.toHaveBeenCalled();
        });

        it('should display error notification when service account delete fails', function() {
            serviceAccountService.remove.andReturn($q.reject());

            vm.remove('token');
            $rootScope.$apply();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminServiceAccount.delete.question', 'adminServiceAccount.delete');
            expect(loadingModalService.open).toHaveBeenCalled();
            expect(serviceAccountService.remove).toHaveBeenCalledWith('token');
            expect(notificationService.success).not.toHaveBeenCalled();
            expect(notificationService.error).toHaveBeenCalledWith('adminServiceAccount.delete.failure');
            expect(loadingModalService.close).toHaveBeenCalled();
            expect($state.reload).not.toHaveBeenCalled();
        });
    });
});
