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
        'SupervisoryNodeRepository', 'loadingModalService', 'notificationService', '$q', 'confirmService', '$state'
    ];

    function AdminSupervisoryNodeEditService(SupervisoryNodeRepository, loadingModalService, notificationService, $q,
                                             confirmService, $state) {

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
                    decorateRemovePartnerNode(supervisoryNode);
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
                        $state.go('openlmis.administration.supervisoryNodes', {}, {
                            reload: true
                        });
                        return supervisoryNode;
                    })
                    .catch(function(error) {
                        notificationService.error('adminSupervisoryNodeEdit.failedToUpdateSupervisoryNode');
                        loadingModalService.close();
                        return $q.reject(error);
                    });
            };
        }

        function decorateRemoveChildNode(supervisoryNode) {
            return decorateRemovalAction(supervisoryNode, {
                actionName: 'removeChildNode',
                confirmMessage: 'adminSupervisoryNodeEdit.confirmChildNodeRemoval',
                confirmButtonLabel: 'adminSupervisoryNodeEdit.removeChildNode'
            });
        }

        function decorateRemovePartnerNode(supervisoryNode) {
            return decorateRemovalAction(supervisoryNode, {
                actionName: 'removePartnerNode',
                confirmMessage: 'adminSupervisoryNodeEdit.confirmPartnerNodeRemoval',
                confirmButtonLabel: 'adminSupervisoryNodeEdit.removePartnerNode'
            });
        }

        function decorateRemovalAction(supervisoryNode, config) {
            var originalAction = supervisoryNode[config.actionName];
            supervisoryNode[config.actionName] = function() {
                var args = arguments;
                return confirmService.confirmDestroy(config.confirmMessage, config.confirmButtonLabel)
                    .then(function() {
                        loadingModalService.open();
                        return originalAction.apply(supervisoryNode, args);
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