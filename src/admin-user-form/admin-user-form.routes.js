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

	angular.module('admin-user-form').config(routes);

	routes.$inject = ['$stateProvider', 'ADMINISTRATION_RIGHTS'];

	function routes($stateProvider, ADMINISTRATION_RIGHTS) {

		$stateProvider.state('administration.users.form', {
			label: 'adminUserForm.addEditUser',
			url: '/users/form/:id',
			accessRights: [ADMINISTRATION_RIGHTS.USERS_MANAGE],
			resolve: {
				roles: function(referencedataRoleFactory) {
					return referencedataRoleFactory.getAllWithType();
				},
				programs: function(programService) {
					return programService.getAll();
				},
				supervisoryNodes: function(supervisoryNodeFactory) {
					return supervisoryNodeFactory.getAllSupervisoryNodesWithDisplay();
				},
				warehouses: function(facilityService) {
					return facilityService.getAll();
				},
				user: function($q, referencedataUserService, userRoleAssignmentFactory, $stateParams, roles) {
                    if($stateParams.id) {
						var deferred = $q.defer();
						referencedataUserService.get($stateParams.id).then(function(user) {
							userRoleAssignmentFactory.addTypeToRoleAssignments(user.roleAssignments, roles);
							deferred.resolve(user);
						}, deferred.reject);
						return deferred.promise;
					}
                    return undefined;
				}
			},
			views: {
                '@': {
                    controller: 'UserFormController',
                    templateUrl: 'admin-user-form/user-form.html',
                    controllerAs: 'vm',
                }
            }
		});
	}
})();