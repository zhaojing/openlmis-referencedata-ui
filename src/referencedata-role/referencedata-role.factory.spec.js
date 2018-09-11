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

describe('referencedataRoleService', function() {

    var $q, $rootScope, roles, referencedataRoleService, referencedataRoleFactory;

    beforeEach(function() {
        module('referencedata-role', function($provide) {
            referencedataRoleService = jasmine.createSpyObj('referencedataRoleService', ['getAll']);
            $provide.service('referencedataRoleService', function() {
                return referencedataRoleService;
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            referencedataRoleFactory = $injector.get('referencedataRoleFactory');
        });

        referencedataRoleService.getAll.andReturn($q.when(roles));

        roles = [
            {
                id: '1',
                name: 'Warehouse Clerk',
                rights: [
                    {
                        type: 'type-1'
                    }
                ]
            },
            {
                id: '2',
                name: 'Storeroom Manager',
                rights: [
                    {
                        type: 'type-2'
                    }
                ]
            }
        ];
    });

    describe('getAllWithType', function() {

        var data;

        beforeEach(function() {
            referencedataRoleFactory.getAllWithType().then(function(response) {
                data = response;
            });
            $rootScope.$apply();
        });

        it('should set types property for all roles', function() {
            angular.forEach(data, function(role) {
                expect(role.type).toEqual(role.rights[0].type);
            });
        });
    });
});
