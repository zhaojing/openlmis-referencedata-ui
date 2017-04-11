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

describe('supervisoryNodeFactory', function() {

    var $rootScope, $q, supervisoryNodeService, supervisoryNodeFactory, supervisoryNodes;

    beforeEach(function() {
        module('referencedata-supervisory-node', function($provide) {
            supervisoryNodeService = jasmine.createSpyObj('supervisoryNodeService', ['getAll']);
            $provide.service('supervisoryNodeService', function() {
                return supervisoryNodeService;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            supervisoryNodeFactory = $injector.get('supervisoryNodeFactory');
        });

        supervisoryNodes = [
            {
                id: '1',
                code: 'SN1',
                name: 'node-1',
                facility: {
                    name: 'facility-1'
                }
            },
            {
                id: '2',
                code: 'SN2',
                name: 'node-2',
                facility: {
                    name: 'facility-2'
                }
            }
        ];

        supervisoryNodeService.getAll.andReturn($q.when(supervisoryNodes));
    });

    describe('getAllSupervisoryNodesWithDisplay', function() {

        it('should get all roles', function() {
            var data;

            supervisoryNodeFactory.getAllSupervisoryNodesWithDisplay().then(function(response) {
                data = response;
            });
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(supervisoryNodes));
            expect(data[0].$display).toEqual(data[0].name + ' (' + data[0].facility.name + ')');
            expect(data[1].$display).toEqual(data[1].name + ' (' + data[1].facility.name + ')');
        });
    });
});
