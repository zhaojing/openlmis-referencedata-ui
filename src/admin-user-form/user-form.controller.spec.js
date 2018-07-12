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

describe('UserFormController', function() {

    var $state, $controller, $q, $rootScope, loadingModalService, notificationService, authUserService, confirmService,
        vm, user, facilities, pendingVerificationEmail, VerificationEmailDataBuilder, UserDataBuilder,
        FacilityDataBuilder;

    beforeEach(function() {
        module('admin-user-form');

        inject(function($injector) {
            $state = $injector.get('$state');
            $controller = $injector.get('$controller');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            loadingModalService = $injector.get('loadingModalService');
            notificationService = $injector.get('notificationService');
            VerificationEmailDataBuilder = $injector.get('VerificationEmailDataBuilder');
            UserDataBuilder = $injector.get('UserDataBuilder');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            authUserService = $injector.get('authUserService');
            confirmService = $injector.get('confirmService');
        });

        facilities = [
            new FacilityDataBuilder().build(),
            new FacilityDataBuilder().build()
        ];

        user = new UserDataBuilder()
            .withUsername('random-user')
            .withHomeFacilityId(facilities[0].id)
            .build();

        pendingVerificationEmail = new VerificationEmailDataBuilder().build();

        spyOn($state, 'go');
        spyOn(loadingModalService, 'open').andReturn($q.when(true));
        spyOn(loadingModalService, 'close').andReturn();
        spyOn(notificationService, 'success').andReturn();
        spyOn(user, 'removeHomeFacilityRights');
        spyOn(user, 'save').andReturn();
        spyOn(authUserService, 'sendVerificationEmail').andReturn();
        spyOn(confirmService, 'confirmDestroy').andReturn();

        vm = $controller('UserFormController', {
            user: user,
            facilities: facilities,
            pendingVerificationEmail: pendingVerificationEmail
        });
    });

    describe('init', function() {

        it('should expose saveUser method', function() {
            vm.$onInit();

            expect(angular.isFunction(vm.saveUser)).toBe(true);
        });

        it('should set user', function() {
            vm.$onInit();

            expect(vm.user).toBe(user);
        });

        it('should set updateMode', function() {
            vm.$onInit();

            expect(vm.updateMode).toBe(true);
        });

        it('should set initialUsername', function() {
            vm.$onInit();

            expect(vm.initialUsername).toBe('random-user');
        });

        it('should set not set updateMode if creating new user', function() {
            user.id = undefined;

            vm.$onInit();

            expect(vm.updateMode).toBe(false);
        });

        it('should set pendingVerificationEmail', function() {
            vm.$onInit();

            expect(vm.pendingVerificationEmail).toBe(pendingVerificationEmail);
        });
    });

    describe('saveUser', function() {

        beforeEach(function() {
            vm.$onInit();

            confirmService.confirmDestroy.andReturn($q.resolve());
        });

        it('should update homeFacilityId', function() {
            vm.homeFacility = facilities[1];

            vm.saveUser();

            expect(user.homeFacilityId).toEqual(vm.homeFacility.id);
        });

        it('should clear homeFacilityId', function() {
            vm.homeFacility = undefined;

            vm.saveUser();

            expect(user.homeFacilityId).toBeUndefined();
        });

        it('should not ask to clear home facility rights if facility has not changed', function() {
            vm.saveUser();

            expect(confirmService.confirmDestroy).not.toHaveBeenCalled();
        });

        it('should save user', function() {
            vm.saveUser();

            expect(user.save).toHaveBeenCalled();
        });

        it('should ask to remove home facility rights if home facility changed', function() {
            vm.homeFacility = facilities[1];

            vm.saveUser();

            expect(confirmService.confirmDestroy).toHaveBeenCalled();
        });

        it('should save user with home facility rights after dismissing confirmation modal', function() {
            confirmService.confirmDestroy.andReturn($q.reject());
            vm.homeFacility = facilities[1];

            vm.saveUser();
            $rootScope.$apply();

            expect(user.save).toHaveBeenCalled();
            expect(user.removeHomeFacilityRights).not.toHaveBeenCalled();
        });

        it('should remove home facility right after confirmation', function() {
            vm.homeFacility = facilities[1];

            vm.saveUser();
            $rootScope.$apply();

            expect(user.save).toHaveBeenCalled();
            expect(user.removeHomeFacilityRights).toHaveBeenCalled();
        });

    });

    describe('sendVerificationEmail', function() {

        beforeEach(function() {
            vm.$onInit();
        });

        it('should send verification email', function() {
            authUserService.sendVerificationEmail.andReturn($q.when(true));
            vm.sendVerificationEmail();
            $rootScope.$apply();

            expect(authUserService.sendVerificationEmail).toHaveBeenCalledWith(vm.user.id);
            expect(notificationService.success).toHaveBeenCalledWith('adminUserForm.sendVerificationEmail.success');
        });

    });

});
