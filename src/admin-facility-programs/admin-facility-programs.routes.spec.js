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

describe('openlmis.administration.facilities.facility.programs state', function() {

    var state, $state, openlmisModalService, dialogSpy, $q, $rootScope, programService, programs,
        facilityOperatorService, facilityOperators, geographicZoneService, facilityTypeService,
        facilityTypes, geographicZones, ProgramDataBuilder, FacilityOperatorDataBuilder,
        FacilityTypeDataBuilder, GeographicZoneDataBuilder;

    beforeEach(prepareSuite);

    it('should expect facility from parent state', function() {
        expect(state.parentResolves.indexOf('facility')).toBeGreaterThan(-1);
    });

    it('should resolve programs', function() {
        var result;

        state.resolve.programs(programService).then(function(programs) {
            result = programs;
        });
        $rootScope.$apply();

        expect(result).toEqual(programs);
    });

    it('should resolve facilityOperators', function() {
        var result;

        state.resolve.facilityOperators(facilityOperatorService).then(function(facilityOperators) {
            result = facilityOperators;
        });
        $rootScope.$apply();

        expect(result).toEqual(facilityOperators);
    });

    it('should resolve geographicZones', function() {
        var result;

        state.resolve.geographicZones($q, geographicZoneService).then(function(geographicZones) {
            result = geographicZones;
        });
        $rootScope.$apply();

        expect(result).toEqual(geographicZones);
    });

    it('should resolve facilityTypes', function() {
        var result;

        state.resolve.facilityTypes(facilityTypeService).then(function(facilityTypes) {
            result = facilityTypes;
        });
        $rootScope.$apply();

        expect(result).toEqual(facilityTypes);
    });

    it('should use facility-programs.html template', function() {
        expect(state.templateUrl).toEqual('admin-facility-programs/facility-programs.html');
    });

    it('should expose controller as vm', function() {
        expect(state.controllerAs).toEqual('vm');
    });

    it('should expose FacilityViewController', function() {
        expect(state.controller).toEqual('FacilityViewController');
    });

    function prepareSuite() {
        module('openlmis-modal-state', function($provide) {
            $provide.provider('modalState', function($stateProvider) {
                return $stateProvider;
            });
        });
        module('admin-facility-programs');
        module('admin-facility-view');

        inject(function($injector) {
            $state = $injector.get('$state');
            openlmisModalService = $injector.get('openlmisModalService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            programService = $injector.get('programService');
            facilityOperatorService = $injector.get('facilityOperatorService');
            geographicZoneService = $injector.get('geographicZoneService');
            facilityTypeService = $injector.get('facilityTypeService');
            ProgramDataBuilder = $injector.get('ProgramDataBuilder');
            FacilityOperatorDataBuilder = $injector.get('FacilityOperatorDataBuilder');
            FacilityTypeDataBuilder = $injector.get('FacilityTypeDataBuilder');
            GeographicZoneDataBuilder = $injector.get('GeographicZoneDataBuilder');
        });

        prepareTestData();
        prepareSpies();
    }

    function prepareTestData() {
        programs = [
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build(),
            new ProgramDataBuilder().build()
        ];

        facilityTypes = [
            new FacilityTypeDataBuilder().build(),
            new FacilityTypeDataBuilder().build(),
            new FacilityTypeDataBuilder().build()
        ];

        facilityOperators = [
            new FacilityOperatorDataBuilder().build(),
            new FacilityOperatorDataBuilder().build(),
            new FacilityOperatorDataBuilder().build()
        ];

        geographicZones = [
            new GeographicZoneDataBuilder().build(),
            new GeographicZoneDataBuilder().build(),
            new GeographicZoneDataBuilder().build()
        ];

        dialogSpy = jasmine.createSpyObj('dialog', ['hide']);

        state = $state.get('openlmis.administration.facilities.facility.programs');
    }

    function prepareSpies() {
        spyOn(openlmisModalService, 'createDialog').andReturn(dialogSpy);
        spyOn(programService, 'getAll').andReturn($q.when(programs));
        spyOn(facilityOperatorService, 'getAll').andReturn($q.when(facilityOperators));
        spyOn(facilityTypeService, 'query').andReturn($q.when({
            content: facilityTypes
        }));
        spyOn(geographicZoneService, 'getAll').andReturn($q.when({
            content: geographicZones
        }));
    }

});
