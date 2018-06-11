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

describe('role type filter', function() {

    var roleTypeFilter, $filter, messageService;

    beforeEach(function() {
        module('admin-role-form');

        inject(function($injector) {
            $filter = $injector.get('$filter');
            messageService = $injector.get('messageService');
        });

        roleTypeFilter = $filter('roleType');

        spyOn(messageService, 'get');
    });

    it('should return undefined for undefined', function() {
        expect(roleTypeFilter()).toBeUndefined();
    });

    it('should return translated role name', function() {
        messageService.get.andReturn('Role Type Name');

        expect(roleTypeFilter('ROLE_TYPE')).toEqual('Role Type Name');
        expect(messageService.get).toHaveBeenCalledWith('adminRoleForm.roleType.label');
    });

    it('should return translated role description if flag is set', function() {
        messageService.get.andReturn('Role Type Description');

        expect(roleTypeFilter('ROLE_TYPE', true)).toEqual('Role Type Description');
        expect(messageService.get).toHaveBeenCalledWith('adminRoleForm.roleType.description');
    });

});