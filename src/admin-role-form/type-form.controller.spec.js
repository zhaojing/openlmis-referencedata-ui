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
describe('TypeFormController', function() {

    var vm, $state, types;

    beforeEach(function() {
        module('admin-role-form');

        types = [
            'TYPE_ONE',
            'TYPE_TWO',
            'TYPE_THREE'
        ];

        inject(function($injector) {
            $state = $injector.get('$state');

            vm = $injector.get('$controller')('TypeFormController', {
                types: types
            });
        });

        spyOn($state, 'go');
    });

    it('selectType should redirect to the role creation screen', function() {
        vm.selectType(types[1]);

        expect($state.go).toHaveBeenCalledWith('openlmis.administration.roles.createUpdate', {
            type: types[1]
        });
    });

});
