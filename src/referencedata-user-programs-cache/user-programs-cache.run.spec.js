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

describe('user programs cache run', function() {
    var programService, $rootScope, loadingService, authorizationService,
        user;

    beforeEach(function() {
        module('referencedata-user-programs-cache');

        inject(function($injector) {
            programService = $injector.get('programService');
            loadingService = $injector.get('loadingService');
            authorizationService = $injector.get('authorizationService');
            $rootScope = $injector.get('$rootScope');
        });

        user = {
            user_id: 'user-id',
            username: 'some-user'
        };
    });

    it('should clear user programs cache on logout', function() {
        spyOn(programService, 'clearUserProgramsCache');

        $rootScope.$emit('openlmis-auth.logout');
        $rootScope.$apply();

        expect(programService.clearUserProgramsCache).toHaveBeenCalled();
    });
});
