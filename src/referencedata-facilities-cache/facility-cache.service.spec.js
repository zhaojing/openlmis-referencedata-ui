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

describe('facilityCacheService', function() {
	var facilityCacheService, facilityService, $rootScope;

	beforeEach(module('referencedata-facilities-cache'));

	beforeEach(inject(function($q, _facilityCacheService_, _facilityService_, _$rootScope_){
		facilityCacheService = _facilityCacheService_;
		facilityService = _facilityService_;
		$rootScope = _$rootScope_;

		spyOn(facilityService, 'getAllMinimal').andReturn($q.resolve([]));
		spyOn(facilityService, 'clearMinimalFacilitiesCache').andCallThrough();
	}));

	it('will download a list of facilities when the user logs in', function() {
		$rootScope.$emit('openlmis-auth.login');

		expect(facilityService.getAllMinimal).toHaveBeenCalled();
	});

	it('will register with loadingService after user logs in', inject(function(loadingService) {
		spyOn(loadingService, 'register');

		$rootScope.$emit('openlmis-auth.login');

		expect(loadingService.register).toHaveBeenCalled();
		expect(loadingService.register.mostRecentCall.args[0]).toBe('referencedata-facilities-cache.loading');
	}));

	it('will clear cached facilities when a user logs out', function() {
		$rootScope.$emit('openlmis-auth.logout');

		expect(facilityService.clearMinimalFacilitiesCache).toHaveBeenCalled();
	});

});
