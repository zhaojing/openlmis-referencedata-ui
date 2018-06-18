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

describe('facility-programs.html template', function() {

    var template, $rootScope, $timeout, $scope, messageService, dateUtils;

    beforeEach(prepareSuite);

    describe('title', function() {

        it('should display proper message', function() {
            spyOn(messageService, 'get').andCallFake(function(key, params) {
                if (key === 'adminFacilityPrograms.assignProgramsTo') {
                    return 'Assign Programs to ' + params.facility;
                }
            });
            $scope.vm.facility = {
                name: 'Some Facility'
            };

            $rootScope.$apply();

            expect(
                template.find('.modal-title').html()
                    .indexOf('Assign Programs to Some Facility') > -1
            ).toBe(true);
        });

    });

    describe('Program selection', function() {

        it('should show programs as names', function() {
            $scope.vm.programs = [{
                id: 'program-one-id',
                name: 'Program One'
            }, {
                id: 'program-two-id',
                name: 'Program Two'
            }];

            $rootScope.$apply();

            var options = template.find('#program').find('option');
            expect(angular.element(options[1]).html()).toEqual('Program One');
            expect(angular.element(options[2]).html()).toEqual('Program Two');
        });

        it('should assign whole object', function() {
            $scope.vm.programs = [{
                id: 'program-one-id',
                name: 'Program One'
            }];

            $rootScope.$apply();

            template.find('#program').find('option:contains(\'Program One\')')
                .prop('selected', 'selected')
                .trigger('change');

            expect($scope.vm.selectedProgram).toEqual($scope.vm.programs[0]);
        });

    });

    describe('add-program-form', function() {

        var form, formCtrl;

        beforeEach(function() {
            form = template.find('#add-program-form');
            formCtrl = form.controller('form');
        });

        it('should require program', function() {
            $scope.vm.selectedProgram = undefined;
            $rootScope.$apply();

            form.triggerHandler('submit');
            $rootScope.$apply();

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should require start date', function() {
            $scope.vm.selectedStartDate = undefined;
            $rootScope.$apply();

            form.triggerHandler('submit');
            $rootScope.$apply();

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should call $scope.vm.addProgram on click', function() {
            $scope.vm.addProgram = jasmine.createSpy('addProgram');

            $scope.vm.selectedProgram = {
                id: 'some-programs-id'
            };
            $scope.vm.selectedStartDate = new Date('08/10/2017');

            $rootScope.$apply();
            form.triggerHandler('submit');
            $rootScope.$apply();

            expect($scope.vm.addProgram).toHaveBeenCalled();
        });

        it('should reload form after submit', function() {
            expect(form.attr('reload-form')).not.toBeUndefined();
        });

    });


    describe('associatedPrograms form', function() {

        var form;

        beforeEach(function() {
            form = template.find('#associatedPrograms');
        });

        it('should call vm.saveFacilityDetails on submit', function() {
            $scope.vm.saveFacilityDetails =
                jasmine.createSpy('saveFacilityDetails');
            $scope.vm.facilityWithPrograms = {
                supportedPrograms: [{
                    supportStartDate: new Date('08/10/2017')
                }, {
                    supportStartDate: new Date('08/10/2017')
                }]
            };
            $rootScope.$apply();

            form.triggerHandler('submit');
            $rootScope.$apply();

            expect($scope.vm.saveFacilityDetails).toHaveBeenCalled();
        });

    });

    describe('Cancel button', function() {

        it('should move to the facility list page', function() {
            $scope.vm.goToFacilityList = jasmine.createSpy('cancel');

            template.find('#cancel').click();
            $timeout.flush();

            expect($scope.vm.goToFacilityList).toHaveBeenCalled();
        });

    });

    function prepareSuite() {
        module('admin-facility-programs');
        module('admin-facility-view');

        var $compile, $templateRequest;

        inject(function($injector) {
            $compile = $injector.get('$compile');
            $rootScope = $injector.get('$rootScope');
            $templateRequest = $injector.get('$templateRequest');
            $timeout = $injector.get('$timeout');
            messageService = $injector.get('messageService');
            dateUtils = $injector.get('dateUtils');
        });

        $scope = $rootScope.$new();
        $scope.vm = {};

        $templateRequest(
            'admin-facility-programs/facility-programs.html'
        ).then(function(requested) {
            template = $compile(requested)($scope);
        });
        $rootScope.$apply();

        spyOn(dateUtils, 'toDate').andCallFake(function(parameter) {
            return parameter;
        });
    }


});
