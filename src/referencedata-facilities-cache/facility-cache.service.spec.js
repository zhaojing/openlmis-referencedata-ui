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
	}));

	it('will download a list of facilities when the user logs in', function() {
		$rootScope.$emit('auth.login');

		expect(facilityService.getAllMinimal).toHaveBeenCalled();
	});

});