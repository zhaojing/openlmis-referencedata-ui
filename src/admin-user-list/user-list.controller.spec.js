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

    var vm, $state, $q, $controller, $rootScope, confirmSpy, usersList, userPasswordModalFactoryMock,
        stateParams, UserDataBuilder;

    beforeEach(function() {
        module('admin-user-list', function($provide) {
            confirmSpy = jasmine.createSpyObj('confirmService', ['confirm']);
            userPasswordModalFactoryMock = jasmine.createSpyObj('userPasswordModalFactoryMock', ['resetPassword']);

            $provide.service('confirmService', function() {
                return confirmSpy;
            });

            $provide.service('userPasswordModalFactory', function() {
                return userPasswordModalFactoryMock;
            });
        });

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $rootScope = $injector.get('$rootScope');
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            UserDataBuilder = $injector.get('UserDataBuilder');
        });

        usersList = [
            new UserDataBuilder().withUsername('administrator').build(),
            new UserDataBuilder().withUsername('user').build()
        ];

        vm = $controller('UserListController', {
            users: usersList
        });

        spyOn($state, 'reload').andReturn();
        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        beforeEach(function() {
            stateParams = {
                firstName: usersList[0].firstName,
                lastName: usersList[0].lastName,
                username: usersList[0].username,
                email: usersList[0].email
            };

            vm = $controller('UserListController', {
                users: usersList,
                $stateParams: stateParams
            });
            vm.$onInit();
        });

        it('should expose users', function() {
            expect(vm.users).toEqual(usersList);
        });

        it('should expose firstName', function() {
            expect(vm.firstName).toEqual(usersList[0].firstName);
        });

        it('should expose firstName', function() {
            expect(vm.lastName).toEqual(usersList[0].lastName);
        });

        it('should expose firstName', function() {
            expect(vm.email).toEqual(usersList[0].email);
        });

        it('should expose firstName', function() {
            expect(vm.username).toEqual(usersList[0].username);
        });
    });

    it('should expose sort options', function() {
        expect(vm.options).toEqual({
            'firstName': 'adminUserList.firstName',
            'lastName': 'adminUserList.lastName',
            'username': 'adminUserList.username'
        });
    });

    describe('resetUserPassword', function() {

        var modalDeferred;

        beforeEach(function() {
            modalDeferred = $q.defer();
            userPasswordModalFactoryMock.resetPassword.andReturn(modalDeferred.promise);
        });

        it('should open user password modal', function() {
            vm.resetUserPassword(usersList[0]);

            expect(userPasswordModalFactoryMock.resetPassword).toHaveBeenCalledWith(usersList[0]);
        });

        it('should reload state after password change was successful', function() {
            vm.resetUserPassword(usersList[0]);
            modalDeferred.resolve();
            $rootScope.$apply();

            expect($state.reload).toHaveBeenCalled();
        });

        it('should not reload state if password change was unsuccessful', function() {
            vm.resetUserPassword(usersList[0]);
            modalDeferred.reject();
            $rootScope.$apply();

            expect($state.reload).not.toHaveBeenCalled();
        });
    });

    describe('search', function() {

        it('should set lastName param', function() {
            vm.lastName = 'lastName';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.users', {
                lastName: vm.lastName,
                firstName: undefined,
                email: undefined,
                username: undefined
            }, {reload: true});
        });

        it('should set firstName param', function() {
            vm.firstName = 'firstName';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.users', {
                lastName: undefined,
                firstName: vm.firstName,
                email: undefined,
                username: undefined
            }, {reload: true});
        });

        it('should set email param', function() {
            vm.email = 'email';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.users', {
                lastName: undefined,
                firstName: undefined,
                email: vm.email,
                username: undefined
            }, {reload: true});
        });

        it('should set username param', function() {
            vm.username = 'username';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.users', {
                lastName: undefined,
                firstName: undefined,
                email: undefined,
                username: vm.username
            }, {reload: true});
        });


        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
