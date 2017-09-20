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

describe('Add Facility page', function() {

    var template, vm, $rootScope, $scope, facility, facilityTypes, geographicZones,
        facilityOperators;

    beforeEach(prepareSuite);

    describe('Facility Code input', function() {

        it('should be of type text', function() {
            expect(template.find('#facility-code').attr('type')).toEqual('text');
        });

    });

    describe('Facility Name input', function() {

        it('should be of type text', function() {
            expect(template.find('#facility-name').attr('type')).toEqual('text');
        });

    });

    describe('Facility Type selection', function() {

        var select;

        beforeEach(function() {
            select = template.find('#facility-type');
        });

        it('should be a select', function() {
            expect(select.is('select')).toBe(true);
        });

        it('should show facility type names as options', function() {
            var html = select.html();

            expect(html.indexOf('Warehouse') > -1).toBe(true);
            expect(html.indexOf('Health Center') > -1).toBe(true);
            expect(html.indexOf('District Hospital') > -1).toBe(true);
        });

        it('should assign whole object', function() {
            select.find('option:contains("Health Center")')
                .prop('selected', 'selected')
                .trigger('change');

            expect(vm.facility.type).toEqual(facilityTypes[1]);
        });

    });

    describe('Active Facility input', function() {

        it('should be a checkbox', function() {
            expect(template.find('#active-facility').attr('type')).toEqual('checkbox');
        });

    });

    describe('Enabled input', function() {

        it('should be a checkbox', function() {
            expect(template.find('#enabled').attr('type')).toEqual('checkbox');
        });

    });

    describe('Operational Date selection', function() {

        it('should use openlmis-datepicker', function() {
            expect(template.find('[input-id=\'operational-date\']').is('openlmis-datepicker'))
                .toBe(true);
        });

    });

    describe('Geographic Zone selection', function() {

        var select;

        beforeEach(function() {
            select = template.find('#geographic-zone');
        });

        it('should be a select', function() {
            expect(select.is('select')).toBe(true);
        });

        it('should show facility type names as options', function() {
            var html = select.html();

            expect(html.indexOf('Malawi') > -1).toBe(true);
            expect(html.indexOf('Central Region') > -1).toBe(true);
            expect(html.indexOf('Northern Region') > -1).toBe(true);
        });

        it('should assign whole object', function() {
            select.find('option:contains("Central Region")')
                .prop('selected', 'selected')
                .trigger('change');

            expect(vm.facility.geographicZone).toEqual(geographicZones[1]);
        });

    });

    describe('Facility Operators selection', function() {

        var select;

        beforeEach(function() {
            select = template.find('#facility-operator');
        });

        it('should be a select', function() {
            expect(select.is('select')).toBe(true);
        });

        it('should show facility type names as options', function() {
            var html = select.html();

            expect(html.indexOf('Ministry of Health') > -1).toBe(true);
            expect(html.indexOf('Doctors Without Borders') > -1).toBe(true);
        });

        it('should assign whole object', function() {
            select.find('option:contains("Doctors Without Borders")')
                .prop('selected', 'selected')
                .trigger('change');

            expect(vm.facility.operator).toEqual(facilityOperators[1]);
        });

    });

    describe('add-facility-form', function() {

        var form, formCtrl;

        beforeEach(function() {
            form = template.find('#add-facility-form');
            formCtrl = form.controller('form');

            vm.facility.code = 'FC01';
            vm.facility.name = 'Some Facility';
            vm.facility.type = facilityTypes[0];
            vm.facility.geographicZone = geographicZones[0];
            vm.facility.description = 'Some Description';
            vm.facility.operator = facilityOperators[0];
        });

        it('should require facility code', function() {
            vm.facility.code = undefined;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should require facility name', function() {
            vm.facility.name = undefined;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should require facility type', function() {
            vm.facility.type = undefined;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should treat false as a valid value for active facility', function() {
            vm.facility.active = false;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$valid).toBe(true);
        });

        it('should treat false as a valid value for enabled', function() {
            vm.facility.enabled = false;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$valid).toBe(true);
        });

        it('should require geographic zone', function() {
            vm.facility.geographicZone = undefined;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$invalid).toBe(true);
        });

        it('should not require description', function() {
            vm.facility.description = undefined;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$valid).toBe(true);
        });

        it('should not require facility operator', function() {
            vm.facility.operator = undefined;

            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(formCtrl.$valid).toBe(true);
        });

        it('should call vm.save method', function() {
            $rootScope.$apply();
            form.triggerHandler('submit');

            expect(vm.save).toHaveBeenCalled();
        });

    });

    describe('Cancel', function() {

        it('should take user to the previous state', function() {
            template.find('#cancel').click();
            $rootScope.$apply();

            expect(vm.save)
        });

    });

    function prepareSuite() {
        var $controller, $compile, $templateRequest;

        module('admin-facility-add');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $compile = $injector.get('$compile');
            $templateRequest = $injector.get('$templateRequest');
            $rootScope = $injector.get('$rootScope');
        });

        facility = {
            id: 'some-facility-id'
        };

        facilityTypes = [{
            id: 'e2faaa9e-4b2d-4212-bb60-fd62970b2113',
            name: 'Warehouse'
        }, {
            id: 'ac1d268b-ce10-455f-bf87-9c667da8f060',
            name: 'Health Center'
        }, {
            id: '663b1d34-cc17-4d60-9619-e553e45aa441',
            name: 'District Hospital'
        }];

        geographicZones = [{
            name: 'Malawi',
            id: '4e471242-da63-436c-8157-ade3e615c848'
        }, {
            name: 'Central Region',
            id: '58d51132-de7d-49f6-ba8d-fd2b5673c3ff'
        }, {
            name: 'Northern Region',
            id: '3daa08a2-69d4-40e8-8af1-e08e894f6b19'
        }];

        facilityOperators = [{
            "id": "9456c3e9-c4a6-4a28-9e08-47ceb16a4121",
            "name": "Ministry of Health"
        }, {
            "id": "1074353d-7364-4618-a127-708d7303a231",
            "name": "Doctors Without Borders"
        }];

        $scope = $rootScope.$new();
        vm = {
            facility: facility,
            facilityTypes: facilityTypes,
            geographicZones: geographicZones,
            facilityOperators: facilityOperators,
            save: jasmine.createSpy('save'),
            goToPreviousState: jasmine.createSpy('goToPreviousState')
        };
        $scope.vm = vm;

        $templateRequest('admin-facility-add/facility-add.html').then(function(requested) {
            template = $compile(requested)($scope);
        });
        $rootScope.$apply();
    }

});
