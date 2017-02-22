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

	angular.module('requisition-search').config(routes);

	routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS', 'paginatedRouterProvider'];

	function routes($stateProvider, REQUISITION_RIGHTS, paginatedRouterProvider) {

		$stateProvider.state('requisitions.search', {
			showInNavigation: true,
			isOffline: true,
			label: 'link.requisition.view',
			url: '/view?program&facility&initiatedDateFrom&initiatedDateTo&page&pageSize&offline',
			controller: 'RequisitionSearchController',
			templateUrl: 'requisition-search/requisition-search.html',
			accessRights: [
				REQUISITION_RIGHTS.REQUISITION_VIEW
			],
			controllerAs: 'vm',
			resolve: paginatedRouterProvider.resolve({
				user: function(authorizationService) {
                    return authorizationService.getUser();
                },
		        facilities: function (facilityFactory, user) {
		        	return facilityFactory.getAllUserFacilities(user.user_id);
		        },
				response: function(requisitionService, $stateParams) {
					if ($stateParams.facility) {
						return requisitionService.search($stateParams.offline === 'true', $stateParams);
					}
					return undefined;
				}
		    })
		});

	}

})();
