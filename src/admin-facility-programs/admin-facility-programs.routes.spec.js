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

    var state, $state, openlmisModalService, dialogSpy, facility, $q, $rootScope, programService;

    beforeEach(prepareSuite);

    it('should expect facility from parent state', function() {
        expect(state.parentResolves.indexOf('facility') > -1).toBe(true);
    });

    it('should resolve programs', function() {
        var result;

        state.resolve.programs(programService).then(function(programs) {
            result = programs;
        });
        $rootScope.$apply();

        expect(result).toEqual(programs);
    });

    it('should use facility-programs.html template', function() {
        expect(state.templateUrl).toEqual('admin-facility-programs/facility-programs.html');
    });

    it('should expose controller as vm', function() {
        expect(state.controllerAs).toEqual('vm');
    });

    it('should expose FacilityProgramController', function() {
        expect(state.controller).toEqual('FacilityProgramController');
    });

    function prepareSuite() {
        module('openlmis-modal-state', function($provide) {
            $provide.provider('modalState', function($stateProvider) {
                return $stateProvider;
            });
        });
        module('admin-facility-programs');

        inject(function($injector) {
            $state = $injector.get('$state');
            openlmisModalService = $injector.get('openlmisModalService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            programService = $injector.get('programService');
        });

        prepareTestData();
        prepareSpies();
    }

    function prepareTestData() {
        facility = {
            id: 'some-facility-id'
        };

        programs = [{
            id: "dce17f2e-af3e-40ad-8e00-3496adef44c3"
        }, {
            id: "10845cb9-d365-4aaa-badd-b4fa39c6a26a"
        }, {
            id: "66032ea8-b69b-4102-a1eb-844e57143187"
        }];

        dialogSpy = jasmine.createSpyObj('dialog', ['hide']);

        state = $state.get('openlmis.administration.facilities.facility.programs');
    }

    function prepareSpies() {
        spyOn(openlmisModalService, 'createDialog').andReturn(dialogSpy);
        spyOn(programService, 'getAll').andReturn($q.when(programs));
    }

});
