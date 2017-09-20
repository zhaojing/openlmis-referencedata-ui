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

ddescribe('facility-programs.html template', function() {

    var template, $rootScope, $scope, vm;

    beforeEach(prepareSuite);

    describe('assign-programs-form', function() {

        var form, formCtrl;

        beforeEach(function() {
            form = template.find('#assign-programs-form');
            formCtrl = form.controller('form');
        });

        it('should require program', function() {
            vm.program = undefined;

            form.triggerHandler('submit');
            $rootScope.$apply();

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should require startDate', function() {

        });

    });

    function prepareSuite() {
        module('admin-facility-programs');

        var $compile, $templateRequest;

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $templateRequest = $injector.get('$templateRequest');
            $q = $injector.get('$q');
        });

        vm = {
            facility: facility,
            programs: programs
        };

        $scope = $rootScope.$new();
        $scope.vm = vm;

        $templateRequest(
            'admin-facility-programs/facility-programs.html'
        ).then(function(requested) {
            template = $compile(requested)($scope);
        });
        $rootScope.$apply();
    }


});
