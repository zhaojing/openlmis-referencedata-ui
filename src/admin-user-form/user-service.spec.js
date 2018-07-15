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

describe('UserService', function() {

    var userService, UserService, User, user, userRepositoryMock, $rootScope, UserDataBuilder, $q, loadingModalService,
        notificationService, userPasswordModalFactory, $state;

    beforeEach(function() {
        module('admin-user-form', function($provide) {
            userRepositoryMock = jasmine.createSpyObj('userRepository', ['get']);
            $provide.factory('UserRepository', function() {
                return function() {
                    return userRepositoryMock;
                };
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            User = $injector.get('User');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            UserService = $injector.get('UserService');
            UserDataBuilder = $injector.get('UserDataBuilder');
            notificationService = $injector.get('notificationService');
            loadingModalService = $injector.get('loadingModalService');
            userPasswordModalFactory = $injector.get('userPasswordModalFactory');
        });

        userService = new UserService();
        user = new UserDataBuilder().build();

        userRepositoryMock.get.andReturn($q.resolve(user));

        spyOn(user, 'save');
        spyOn($state, 'go');
        spyOn(loadingModalService, 'open');
        spyOn(loadingModalService, 'close');
        spyOn(notificationService, 'error');
        spyOn(notificationService, 'success');
        spyOn(userPasswordModalFactory, 'createPassword');
    });

    describe('get', function() {

        it('should return new user if ID is not given', function() {
            var result;
            userService.get()
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result instanceof User).toBe(true);
            expect(userRepositoryMock.get).not.toHaveBeenCalled();
        });

        it('should fetch user', function() {
            userService.get(user.id);
            $rootScope.$apply();

            expect(userRepositoryMock.get).toHaveBeenCalledWith(user.id);
        });

        it('should decorate save', function() {
            var originalSave = user.save;

            var result;
            userService.get()
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result.save).not.toEqual(originalSave);
        });

    });

    describe('decorated save', function() {

        var originalSave, decoratedUser;

        beforeEach(function() {
            originalSave = user.save;

            originalSave.andReturn($q.resolve(user));

            userService.get(user.id)
                .then(function(response) {
                    decoratedUser = response;
                });
            $rootScope.$apply();
        });

        it('should open loading modal', function() {
            decoratedUser.save();

            expect(loadingModalService.open).toHaveBeenCalled();
        });

        it('should show notification after updating user', function() {
            decoratedUser.save();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('adminUserForm.userUpdatedSuccessfully');
        });

        it('should show notification after creating user', function() {
            decoratedUser.id = undefined;

            decoratedUser.save();
            $rootScope.$apply();

            expect(notificationService.success).toHaveBeenCalledWith('adminUserForm.userCreatedSuccessfully');
        });

        it('should open password modal after creating new user', function() {
            decoratedUser.id = undefined;

            decoratedUser.save();
            $rootScope.$apply();

            expect(userPasswordModalFactory.createPassword).toHaveBeenCalledWith(decoratedUser);
        });

        it('should resolve if user dismisses password creation', function() {
            userPasswordModalFactory.createPassword.andReturn($q.reject());

            var result;
            decoratedUser.save()
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(user);
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should resolve if user creates password', function() {
            userPasswordModalFactory.createPassword.andReturn($q.resolve());

            var result;
            decoratedUser.save()
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(user);
            expect($state.go).toHaveBeenCalledWith('^', {}, {
                reload: true
            });
        });

        it('should show notification if update fails', function() {
            originalSave.andReturn($q.reject());

            decoratedUser.save();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith('adminUserForm.failedToUpdateUser');
        });

        it('should show notification if creation fails', function() {
            decoratedUser.id = undefined;
            originalSave.andReturn($q.reject());

            decoratedUser.save();
            $rootScope.$apply();

            expect(notificationService.error).toHaveBeenCalledWith('adminUserForm.failedToCreateUser');
        });

        it('should reject if original save rejects', function() {
            originalSave.andReturn($q.reject());

            var rejected;
            decoratedUser.save()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should close loading modal if save fails', function() {
            originalSave.andReturn($q.reject());

            decoratedUser.save();
            $rootScope.$apply();

            expect(loadingModalService.close).toHaveBeenCalled();
        });

    });

});