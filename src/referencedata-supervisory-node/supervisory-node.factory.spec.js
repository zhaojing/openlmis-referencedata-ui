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

    var $rootScope, $q, supervisoryNodeService, supervisoryNodeFactory, facilityService,
        supervisoryNodes, facilities, SupervisoryNodeDataBuilder;

    beforeEach(function() {
        module('referencedata-supervisory-node', function($provide) {
            supervisoryNodeService = jasmine.createSpyObj('supervisoryNodeService', ['query', 'get']);
            $provide.service('supervisoryNodeService', function() {
                return supervisoryNodeService;
            });

            facilityService = jasmine.createSpyObj('facilityService', ['getAllMinimal']);
            $provide.service('facilityService', function() {
                return facilityService;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            supervisoryNodeFactory = $injector.get('supervisoryNodeFactory');
            SupervisoryNodeDataBuilder = $injector.get('SupervisoryNodeDataBuilder');
        });

        facilities = [
            {
                name: 'facility-1',
                id: 'facility-id-1'
            },
            {
                name: 'facility-2',
                id: 'facility-id-2'
            }
        ];
        var supervisoryNodeChild = new SupervisoryNodeDataBuilder().withFacility(facilities[1])
            .build();
        supervisoryNodes = [
            new SupervisoryNodeDataBuilder().addChildNode(supervisoryNodeChild)
                .withFacility(facilities[0])
                .build(),
            supervisoryNodeChild,
            new SupervisoryNodeDataBuilder().buildWithoutFacility()
        ];

        supervisoryNodeService.query.andReturn($q.when({
            content: supervisoryNodes
        }));
    });

    describe('getAllSupervisoryNodesWithDisplay', function() {

        it('should get all roles', function() {
            var data;

            supervisoryNodeFactory.getAllSupervisoryNodesWithDisplay().then(function(response) {
                data = response;
            });
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(supervisoryNodes));
        });
    });

    describe('getSupervisoryNode', function() {

        beforeEach(function() {
            supervisoryNodeService.get.andReturn($q.when(supervisoryNodes[0]));
            facilityService.getAllMinimal.andReturn($q.when(facilities));
        });

        it('should return promise', function() {
            var result = supervisoryNodeFactory.getSupervisoryNode(supervisoryNodes[0].id);

            expect(angular.isFunction(result.then)).toBe(true);
        });

        it('should call supervisoryNodeService', function() {
            supervisoryNodeFactory.getSupervisoryNode(supervisoryNodes[0].id);

            expect(supervisoryNodeService.get).toHaveBeenCalledWith(supervisoryNodes[0].id);
        });

        it('should call facilityService', function() {
            supervisoryNodeFactory.getSupervisoryNode(supervisoryNodes[0].id);

            expect(facilityService.getAllMinimal).toHaveBeenCalled();
        });

        it('should add facility info to child nodes', function() {
            var supervisoryNode;

            supervisoryNodeFactory.getSupervisoryNode(supervisoryNodes[0].id).then(function(response) {
                supervisoryNode = response;
            });
            $rootScope.$apply();

            expect(supervisoryNode.id).toEqual(supervisoryNodes[0].id);
            angular.forEach(supervisoryNode.childNodes, function(node) {
                expect(node.$facility).not.toBe(undefined);
                expect(node.$facility.id).toEqual(node.facility.id);
            });
        });
    });
});
