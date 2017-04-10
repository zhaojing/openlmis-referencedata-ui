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

describe('UserListController', function () {

    var vm, $state, $q, $controller, $rootScope, confirmSpy, usersList, UserPasswordModalMock;

    beforeEach(function() {
        module('admin-user-list', function($provide) {
            confirmSpy = jasmine.createSpyObj('confirmService', ['confirm']);
            UserPasswordModalMock = jasmine.createSpy('UserPasswordModalMock');

            $provide.service('confirmService', function() {
                return confirmSpy;
            });

            $provide.service('UserPasswordModal', function() {
                return UserPasswordModalMock;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            usersList = [
                {
                    id: 1,
                    username: 'administrator'
                },
                {
                    id: 2,
                    username: 'user'
                }
            ];
            stateParams = {
                page: 0,
                size: 10
            };

            vm = $controller('UserListController', {
                users: usersList
            });
        });

        spyOn($state, 'reload').andReturn();
        spyOn($state, 'go').andReturn();
    });

    describe('init', function() {

        beforeEach(function() {
            $controllerMock = jasmine.createSpy('$controller').andCallFake(function() {
                vm.stateParams = {};
            });

            vm = $controller('UserListController', {
                users: usersList,
                $controller: $controllerMock
            });

        });

        it('should expose go to user form method', function() {
            expect(angular.isFunction(vm.goToUserForm)).toBe(true);
        });
    });

    describe('resetUserPassword', function() {

        var modalDeferred, username;

        beforeEach(function() {
            username = 'username';
            modalDeferred = $q.defer();
            UserPasswordModalMock.andReturn(modalDeferred.promise);
        });

        it('should open user password modal', function() {
            vm.resetUserPassword(username);

            expect(UserPasswordModalMock).toHaveBeenCalledWith(username);
        });

        it('should reload state after password change was successful', function() {
            vm.resetUserPassword(username);
            modalDeferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should not reload state if password change was unsuccessful', function() {
            vm.resetUserPassword(username);
            modalDeferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });
    });

    describe('goToUserForm', function() {

        it('should redirect to user edit', function() {
            var userId = 'user-id';

            vm.goToUserForm(userId);
            expect($state.go).toHaveBeenCalledWith('administration.users.form', {
				id: userId
			});
        });

        it('should redirect to create edit', function() {
            vm.goToUserForm();
            expect($state.go).toHaveBeenCalledWith('administration.users.form', {
				id: undefined
			});
        });
    });

    describe('search', function() {

        it('should set lastName param', function() {
            vm.lastName = 'lastName';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('administration.users', {
                lastName: vm.lastName,
                firstName: undefined,
                email: undefined
            }, {reload: true});
        });

        it('should set firstName param', function() {
            vm.firstName = 'firstName';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('administration.users', {
                lastName: undefined,
                firstName: vm.firstName,
                email: undefined
            }, {reload: true});
        });

        it('should set email param', function() {
            vm.email = 'email';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('administration.users', {
                lastName: undefined,
                firstName: undefined,
                email: vm.email,
            }, {reload: true});
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
