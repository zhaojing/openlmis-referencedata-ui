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

describe('user-password-modal.html template', function() {

    var template, vm, $q, $timeout, $state, user, $rootScope;

    beforeEach(prepareSuite);

    describe('Show password checkbox', function() {

        beforeEach(function() {

            vm.isEmailResetSelected = false;
            $rootScope.$apply();

        });

        it('should change input type', function() {
            var input = template.find('#newPassword');

            expect(input.attr('type')).toEqual('password');

            template.find('#showPassword').click();
            $timeout.flush();

            expect(input.attr('type')).toEqual('text');

            template.find('#showPassword').click();

            expect(input.attr('type')).toEqual('password');
        });

    });

    describe('SendResetEmail', function() {

        it('should show option if user has email', function() {
            var button = template.find('#send-email-radio');

            expect(button.length).toEqual(1);
        });

        it('should hide option if user has no email', function() {
            delete vm.user.email;
            $rootScope.$apply();

            var button = template.find('#send-email-radio');

            expect(button.length).toEqual(0);
        });

    });

    function prepareSuite() {
        var $controller, $templateRequest, $compile, $scope;

        module('admin-user-form');

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $templateRequest = $injector.get('$templateRequest');
            $controller = $injector.get('$controller');
            $compile = $injector.get('$compile');
            $state = $injector.get('$state');
            $timeout = $injector.get('$timeout');
            $q = $injector.get('$q');
        });

        $scope = $rootScope.$new();

        spyOn($state, 'go');

        user = {
            username: 'random-user',
            newPassword: 'new-password',
            email: 'random-email'
        };

        vm = $controller('UserPasswordModalController', {
            user: user,
            modalDeferred: $q.defer(),
            title: 'adminUserForm.createPassword',
            hideCancel: false
        });

        vm.$onInit();

        $scope.vm = vm;

        $templateRequest('admin-user-form/user-password-modal.html').then(function(requested) {
            template = $compile(requested)($scope);
        });
        $rootScope.$apply();
    }

});
