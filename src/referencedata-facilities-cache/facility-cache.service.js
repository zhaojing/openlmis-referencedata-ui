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

(function() {

	'use strict';

	// listens for login/logout events, and 
	// downloads/clear the minimal facility
	// cache
	// 
	angular.module('referencedata-facilities-cache')
		.service('facilityCacheService', service);

	service.$inject = ['$q', '$rootScope', 'localStorageFactory', 'facilityService', '$urlRouter'];

	function service($q, $rootScope, localStorageFactory, facilityService, $urlRouter) {
		var cachingFacilitiesPromise;

		this.initialize = initialize;

		function initialize() {
			$rootScope.$on('auth.login', cacheFacilities);
			$rootScope.$on('auth.login-modal', cacheFacilities);

			$rootScope.$on('$stateChangeStart', pauseIfLoading);
		}

		function cacheFacilities() {
			cachingFacilitiesPromise = $q.defer();
			facilityService.getAllMinimal()
			.finally(function(){
				cachingFacilitiesPromise.resolve();
				cachingFacilitiesPromise = undefined;
			});
		}

		function pauseIfLoading(event) {
			if(cachingFacilitiesPromise) {
				event.preventDefault();

				cachingFacilitiesPromise.then(function(){
					$urlRouter.sync();
				});
			}
		}
	}

})();