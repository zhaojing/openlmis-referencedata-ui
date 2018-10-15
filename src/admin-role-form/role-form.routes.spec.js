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

describe('openlmis.administration.roles state', function() {

    var $state, $q, state, $rootScope, referencedataRightService, role, type, right, expectedRight;

    beforeEach(function() {
        module('openlmis-main-state');
        module('openlmis-admin');
        module('admin-role-list');
        module('admin-role-form');

        inject(function($injector) {
            $state = $injector.get('$state');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            referencedataRightService = $injector.get('referencedataRightService');
        });

        role = {
            description: 'sys admin',
            rights: [
                {
                    name: 'right1'
                }
            ]
        };

        right = [
            {
                name: 'right1',
                checked: true
            },
            {
                name: 'right2',
                checked: true
            }
        ];

        expectedRight = [
            {
                name: 'right1',
                checked: true
            },
            {
                name: 'right2',
                checked: false
            }
        ];

        type = 'type';

        spyOn(referencedataRightService, 'search').andReturn($q.when(right));

        state = $state.get('openlmis.administration.roles.createUpdate');
    });

    it('should flag `checked` property to false is right is not in role', function() {
        var result;

        state.resolve.rights($q, role, type, referencedataRightService).then(function(right) {
            result = right;
        });

        $rootScope.$apply();

        expect(result[0].checked).toEqual(expectedRight[0].checked);
        expect(result[1].checked).toEqual(expectedRight[1].checked);

    });

});
