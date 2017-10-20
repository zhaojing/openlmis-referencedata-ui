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

describe('userProgramsCacheService', function() {
	var userCacheService, authorizationService, programService, $rootScope,
        user;

	beforeEach(function() {
        module('referencedata-user-programs-cache');

        inject(function($injector) {
    		userProgramsCacheService = $injector.get('userProgramsCacheService');
    		programService = $injector.get('programService');
            authorizationService = $injector.get('authorizationService');
    		$rootScope = $injector.get('$rootScope');
        });

        user = {
            user_id: 'id'
        };

        spyOn(authorizationService, 'getUser').andReturn(user);
        spyOn(programService, 'getUserPrograms').andReturn($q.resolve([]));
        spyOn(programService, 'clearUserProgramsCache').andReturn();
    });

	it('will download a user when the he/she logs in', function() {
		$rootScope.$emit('openlmis-auth.login');

        expect(authorizationService.getUser).toHaveBeenCalled();
		expect(programService.getUserPrograms).toHaveBeenCalledWith(user.user_id);
	});

	it('will register with loadingService after user logs in', inject(function(loadingService) {
		spyOn(loadingService, 'register');

		$rootScope.$emit('openlmis-auth.login');

		expect(loadingService.register).toHaveBeenCalled();
		expect(loadingService.register.mostRecentCall.args[0]).toBe('referencedata-user-programs-cache.loading');
	}));

	it('will clear cached user when logs out', function() {
		$rootScope.$emit('openlmis-auth.logout');

		expect(programService.clearUserProgramsCache).toHaveBeenCalled();
	});
});
