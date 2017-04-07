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
describe('RoleFormController', function() {

    var vm, referencedataRoleService, role, type, rights;

    beforeEach(function() {
        module('admin-role-form');

        role = {
            name: 'Some role'
        };

        type = 'SOME_ROLE_TYPE';

        rights = [{
            name: 'Some right one',
            checked: false
        }, {
            name: 'Some right two',
            checked: false
        }];

        inject(function($injector) {
            referencedataRoleService = $injector.get('referencedataRoleService');
            vm = $injector.get('$controller')('RoleFormController', {
                role: role,
                type: type,
                rights: rights
            });
        });
    });

    describe('$onInit', function() {

        it('should expose role', function() {
            vm.$onInit();

            expect(vm.role).toBe(role);
        });

        it('should expose type', function() {
            vm.$onInit();

            expect(vm.type).toBe(type);
        });

        it('should expose rights', function() {
            vm.$onInit();

            expect(vm.rights).toBe(rights);
        });

    });

    describe('saveRole', function() {

        var $q, $rootScope, $state, deferred, loadingModalService, notificationService,
            confirmService, confirmDeferred;

        beforeEach(function() {
            inject(function($injector) {
                $q = $injector.get('$q');
                $rootScope = $injector.get('$rootScope');
                $state = $injector.get('$state');
                loadingModalService = $injector.get('loadingModalService');
                notificationService = $injector.get('notificationService');
                confirmService = $injector.get('confirmService');
            });

            deferred = $q.defer();
            confirmDeferred = $q.defer();

            spyOn(referencedataRoleService, 'update').andReturn(deferred.promise);
            spyOn(referencedataRoleService, 'create').andReturn(deferred.promise);
            spyOn(confirmService, 'confirm').andReturn(confirmDeferred.promise);
            spyOn(loadingModalService, 'open').andReturn($q.when());
            spyOn(notificationService, 'success');
            spyOn(loadingModalService, 'close');
            spyOn($state, 'go');

            vm.$onInit();
        });

        it('should update the role if it has id', function() {
            role.id = 'some-id';

            vm.saveRole();
            confirmDeferred.resolve();
            $rootScope.$apply();

            expect(referencedataRoleService.update).toHaveBeenCalledWith(role);
            expect(referencedataRoleService.create).not.toHaveBeenCalled();
        });

        it('should create the role if it does not have an id', function() {
            vm.saveRole();

            expect(referencedataRoleService.create).toHaveBeenCalledWith(role);
            expect(referencedataRoleService.update).not.toHaveBeenCalled();
        });

        it('should open loading modal', function() {
            vm.saveRole();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should show a notification if creation was successful', function() {
            vm.saveRole();
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('adminRoleForm.roleCreatedSuccessfully');
        });

        it('should close loading modal if creation was unsuccessful', function() {
            vm.saveRole();
            deferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should close loading modal if update was unsuccessful', function() {
            role.id = 'some-id';

            vm.saveRole();
            confirmDeferred.resolve();
            deferred.reject();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

        it('should show a notification if update was successful', function() {
            role.id = 'some-id';

            vm.saveRole();
            confirmDeferred.resolve();
            deferred.resolve();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('adminRoleForm.roleUpdatedSuccessfully');
        });

        it('should redirect to role list after success', function() {
            vm.saveRole();
            confirmDeferred.resolve();
            deferred.resolve();
            $rootScope.$apply();

            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should prompt for confirmation if updating', function() {
            role.id = 'some-id';

            vm.saveRole();

            expect(confirmService.confirm).toHaveBeenCalledWith('adminRoleForm.confirm');
        });

        it('should not update if confirmation was not successful', function() {
            role.id = 'some-id';

            vm.saveRole();

            confirmDeferred.reject();
            $rootScope.$apply();

            expect(referencedataRoleService.create).not.toHaveBeenCalled();
            expect(referencedataRoleService.update).not.toHaveBeenCalled();
        });

    });

    describe('isNoneSelected', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should return true if no right is selected', function() {
            var result = vm.isNoneSelected();

            expect(result).toBe(true);
        });

        it('should return false if at least one right is selected', function() {
            vm.rights[1].checked = true;

            var result = vm.isNoneSelected();

            expect(result).toBe(false);
        });

    });

});
