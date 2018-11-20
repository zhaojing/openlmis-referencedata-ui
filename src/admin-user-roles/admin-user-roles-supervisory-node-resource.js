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

    /**
     * @ngdoc service
     * @name admin-user-roles.AdminUserRolesSupervisoryNodeResource
     *
     * @description
     * Communicates with the Supervisory Node REST API of the OpenLMIS server.
     */
    angular
        .module('admin-user-roles')
        .factory('AdminUserRolesSupervisoryNodeResource', AdminUserRolesSupervisoryNodeResource);

    AdminUserRolesSupervisoryNodeResource.inject = ['OpenlmisResource', 'classExtender'];

    function AdminUserRolesSupervisoryNodeResource(OpenlmisResource, classExtender) {

        classExtender.extend(AdminUserRolesSupervisoryNodeResource, OpenlmisResource);

        AdminUserRolesSupervisoryNodeResource.prototype.query = query;

        return AdminUserRolesSupervisoryNodeResource;

        function AdminUserRolesSupervisoryNodeResource(facilitiesMap) {
            this.super('/api/supervisoryNodes');

            this.originalQuery = OpenlmisResource.prototype.query;
            this.facilitiesMap = facilitiesMap;
        }

        function query() {
            var self = this;

            return this.originalQuery()
                .then(function(page) {
                    page.content.forEach(function(node) {
                        if (node.facility) {
                            node.facility = self.facilitiesMap[node.facility.id];
                        }
                    });

                    return page;
                });
        }
    }

})();
