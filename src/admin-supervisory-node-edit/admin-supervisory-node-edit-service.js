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
     * @name admin-supervisory-node-edit.AdminSupervisoryNodeEditService
     *
     * @description
     * Prepared Supervisory Node object to be displayable by the Edit Supervisory Node page.
     */
    angular
        .module('admin-supervisory-node-edit')
        .factory('AdminSupervisoryNodeEditService', AdminSupervisoryNodeEditService);

    AdminSupervisoryNodeEditService.$inject = [
        'SupervisoryNodeRepository', 'loadingModalService', 'notificationService', '$q', 'confirmService'
    ];

    function AdminSupervisoryNodeEditService(SupervisoryNodeRepository, loadingModalService, notificationService, $q,
                                             confirmService) {

        AdminSupervisoryNodeEditService.prototype.getSupervisoryNode = getSupervisoryNode;

        return AdminSupervisoryNodeEditService;

        function AdminSupervisoryNodeEditService() {
            this.repository = new SupervisoryNodeRepository();
        }

        /**
         * @ngdoc method
         * @methodOf admin-supervisory-node-edit.AdminSupervisoryNodeEditService
         * @name getSupervisoryNode
         *
         * @description
         * Returns a Supervisory Node object with methods decorated with loading modal, confirmation modal and
         * notifications.
         *
         * @param {string}           id  the ID of the Supervisory Node
         * @return {SupervisoryNode}     the Supervisory Node
         */
        function getSupervisoryNode(id) {
            return this.repository.get(id)
                .then(function(supervisoryNode) {
                    decorateSave(supervisoryNode);
                    decorateRemoveChildNode(supervisoryNode);
                    return supervisoryNode;
                });
        }

        function decorateSave(supervisoryNode) {
            var originalSave = supervisoryNode.save;

            supervisoryNode.save = function() {
                loadingModalService.open();
                return originalSave.apply(supervisoryNode, arguments)
                    .then(function(supervisoryNode) {
                        notificationService.success('adminSupervisoryNodeEdit.supervisoryNodeUpdatedSuccessfully');
                        return supervisoryNode;
                    })
                    .catch(function(error) {
                        notificationService.error('adminSupervisoryNodeEdit.failedToUpdateSupervisoryNode');
                        return $q.reject(error);
                    })
                    .finally(function() {
                        loadingModalService.close();
                    });
            };
        }

        function decorateRemoveChildNode(supervisoryNode) {
            var originalRemoveChildNode = supervisoryNode.removeChildNode;
            supervisoryNode.removeChildNode = function() {
                var args = arguments;
                return confirmService.confirmDestroy(
                    'adminSupervisoryNodeEdit.confirmChildNodeRemoval',
                    'adminSupervisoryNodeEdit.removeChildNode'
                )
                    .then(function() {
                        loadingModalService.open();
                        return originalRemoveChildNode.apply(supervisoryNode, args);
                    })
                    .catch(function(error) {
                        return $q.reject(error);
                    })
                    .finally(function() {
                        loadingModalService.close();
                    });
            };
        }

    }

})();