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

describe('orderableFactory', function() {

    var $rootScope, $q, orderableService, orderableFactory, programService, orderable, programs;

    beforeEach(function() {
        module('referencedata-orderable', function($provide) {
            orderableService = jasmine.createSpyObj('orderableService', ['get']);
            $provide.service('orderableService', function() {
                return orderableService;
            });

            programService = jasmine.createSpyObj('orderableService', ['getAll']);
            $provide.service('programService', function() {
                return programService;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            orderableFactory = $injector.get('orderableFactory');
        });

        programs = [
            {
                id: '1',
                name: 'program-1'
            },
            {
                id: '2',
                name: 'program-2'
            }
        ];
        orderable = {
            id: 'orderable-id',
            programs: [
                {
                    programId: programs[0].id
                },
                {
                    programId: 'some-id'
                }
            ]
        };
    });

    describe('getOrderableWithProgramData', function() {

        var data;

        beforeEach(function() {
            orderableService.get.andReturn($q.when(orderable));
            programService.getAll.andReturn($q.when(programs));

            orderableFactory.getOrderableWithProgramData(orderable.id).then(function(response) {
                data = response;
            });
            $rootScope.$apply();
        });

        it('should get programs', function() {
            expect(programService.getAll).toHaveBeenCalled();
        });

        it('should get orderable', function() {
            expect(orderableService.get).toHaveBeenCalledWith(orderable.id);
        });

        it('should return orderable', function() {
            expect(data.id).toEqual(orderable.id);
        });

        it('should assign program if exists', function() {
            expect(data.programs[0].$program).not.toBe(undefined);
            expect(data.programs[0].$program).toEqual(programs[0]);
        });

        it('should not assign program if does not exists', function() {
            expect(data.programs[1].$program).toBe(undefined);
        });
    });
});
