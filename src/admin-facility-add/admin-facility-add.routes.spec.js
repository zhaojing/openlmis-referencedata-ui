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

describe('openlmis.administration.facilities.facility.add state', function() {

    var state, $state, $q, $rootScope, openlmisModalService, facilityTypeService, facilityTypes,
        dialogSpy, geographicZoneService, facilityOperatorService, facilityOperators;

    beforeEach(prepareSuite);

    it('should resolve facility types', function() {
        var result;

        state.resolve.facilityTypes(facilityTypeService).then(function(facilityTypes) {
            result = facilityTypes;
        });
        $rootScope.$apply();

        expect(result).toEqual(facilityTypes);
    });

    it('should resolve geographic zones', function() {
        var result;

        state.resolve.geographicZones(geographicZoneService, $q).then(function(geographicZones) {
            result = geographicZones;
        });
        $rootScope.$apply();

        expect(result).toEqual(geographicZones);
    });

    it('should resolve facility operators', function() {
        var result;

        state.resolve.facilityOperators(facilityOperatorService).then(function(facilityOperators) {
            result = facilityOperators;
        });
        $rootScope.$apply();

        expect(result).toEqual(facilityOperators);
    });

    it('should expect facility from parent state', function() {
        expect(state.parentResolves.indexOf('facility') > -1).toBe(true);
    });

    it('should use admin-facility-add.html template', function() {
        expect(state.templateUrl).toEqual('admin-facility-add/facility-add.html');
    });

    it('should use FacilityAddController', function() {
        expect(state.controller).toEqual('FacilityAddController');
    });

    it('should expose controller as vm', function() {
        expect(state.controllerAs).toEqual('vm');
    });

    function prepareSuite() {
        module('openlmis-modal-state', function($provide) {
            $provide.provider('modalState', function($stateProvider) {
                return $stateProvider;
            });
        });
        module('admin-facility-add');

        inject(function($injector) {
            $q = $injector.get('$q');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            facilityTypeService = $injector.get('facilityTypeService');
            openlmisModalService = $injector.get('openlmisModalService');
            geographicZoneService = $injector.get('geographicZoneService');
            facilityOperatorService = $injector.get('facilityOperatorService');
        });

        state = $state.get('openlmis.administration.facilities.facility.add');

        facilityTypes = [{
            id: 'e2faaa9e-4b2d-4212-bb60-fd62970b2113',
            code: 'warehouse',
            name: 'Warehouse',
            description: null,
            displayOrder: 1,
            active: true
        }, {
            id: 'ac1d268b-ce10-455f-bf87-9c667da8f060',
            code: 'health_center',
            name: 'Health Center',
            description: null,
            displayOrder: 2,
            active: true
        }, {
            id: '663b1d34-cc17-4d60-9619-e553e45aa441',
            code: 'dist_hosp',
            name: 'District Hospital',
            description: null,
            displayOrder: 3,
            active: true
        }];

        geographicZones = [{
            id: '9c7c9c59-1200-49fb-b73e-f062c2e1281c'
        }, {
            id: '273a1010-f174-4041-b213-b4f1c57c6b55'
        }];

        facilityOperators = [{
            id: 'e5d1927c-41c2-4a48-a923-89742d669d4f'
        }, {
            id: '0fb6f3c4-1b44-4fc0-a9d3-17d6f846f5a2'
        }];

        facility = {
            id: 'some-facility-id'
        };

        dialogSpy = jasmine.createSpyObj('dialog', ['hide']);
        spyOn(openlmisModalService, 'createDialog').andReturn(dialogSpy);
        spyOn(facilityOperatorService, 'getAll').andReturn($q.when(facilityOperators));
        spyOn(facilityTypeService, 'getAll').andReturn($q.when(facilityTypes));
        spyOn(geographicZoneService, 'getAll').andReturn($q.when({
            content: geographicZones,
            last: true,
            totalElements: 33,
            totalPages: 1,
            numberOfElements: 33,
            sort: null,
            first: true,
            size: 2000,
            number: 0
        }));
    }

});
