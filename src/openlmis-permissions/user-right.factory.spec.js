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

describe('userRightsFactory', function() {

    var $rootScope, $q, rights, userRightsFactory, permissionService, programService;

    beforeEach(module('openlmis-permissions'));

    beforeEach(inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $q = $injector.get('$q');

        permissionService = $injector.get('permissionService');
        spyOn(permissionService, 'load').andReturn($q.resolve(makePermissions()));

        programService = $injector.get('programService');
        spyOn(programService, 'getAllUserPrograms').andReturn($q.resolve(makePrograms()));

        userRightsFactory = $injector.get('userRightsFactory');
    }));

    beforeEach(function() {
        userRightsFactory.buildRights('userId')
        .then(function(builtRights) {
            rights = builtRights;
        });

        $rootScope.$apply();
    });

    it('should get permissions for userId', function() {
        expect(permissionService.load).toHaveBeenCalledWith('userId');
    });

    it('should get all programs for userId', function() {
        expect(programService.getAllUserPrograms).toHaveBeenCalledWith('userId');
    });

    it('should not duplicate rights', function() {
        expect(rights.length).toBe(3);
    });

    it('should group programs', function() {
        expect(rights[0].programIds.length).toBe(2);
        expect(rights[0].programIds[0]).toBe('program1');
        expect(rights[0].programIds[1]).toBe('program2');
    });

    it('should group program codes', function() {
        expect(rights[0].programCodes.length).toBe(2);
        expect(rights[0].programCodes[0]).toBe('p1');
        expect(rights[0].programCodes[1]).toBe('p2');
    });

    it('should group facilities', function() {
        expect(rights[1].facilityIds.length).toBe(2);
        expect(rights[1].facilityIds[0]).toBe('facility-1');
        expect(rights[1].facilityIds[1]).toBe('facility-2');
    });

    it('should mark right as direct if no program or facility id is associated with permission', function() {
        expect(rights[2].isDirect).toBe(true);
        expect(rights[1].isDirect).toBe(false);
    });

    function makePermissions() {
        return [{
            right: 'example',
            facilityId: 'facility-1',
            programId: 'program1'
        }, {
            right: 'example',
            facilityId: 'facility-2',
            programId: 'program1'
        }, {
            right: 'example',
            facilityId: 'facility-3',
            programId: 'program2'
        }, {
            right: 'otherExample',
            facilityId: 'facility-1'
        }, {
            right: 'otherExample',
            facilityId: 'facility-2'
        }, {
            right: 'DIRECT_RIGHT'
        }];
    }

    function makePrograms() {
        return [{
            id: 'program1',
            code: 'p1'
        }, {
            id: 'program2',
            code: 'p2'
        }];
    }
});
