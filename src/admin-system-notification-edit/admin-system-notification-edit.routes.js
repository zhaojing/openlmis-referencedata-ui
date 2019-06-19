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

    angular
        .module('admin-system-notification-edit')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {
        $stateProvider.state('openlmis.administration.systemNotifications.edit', {
            url: '/:id',
            params: {
                id: ''
            },
            views: {
                '@openlmis': {
                    controller: 'AdminSystemNotificationEditController',
                    controllerAs: 'vm',
                    templateUrl: 'admin-system-notification-edit/admin-system-notification-edit.html'
                }
            },
            resolve: {
                systemNotification: function($stateParams, SystemNotificationResource, systemNotifications) {
                    var filtered = systemNotifications.filter(function(systemNotification) {
                        return systemNotification.id === $stateParams.id;
                    });

                    return filtered.length === 1 ?
                        //we copy to avoid editing the entry on the list
                        _.extend({}, filtered[0]) :
                        new SystemNotificationResource().get($stateParams.id);
                },
                author: function(usersMap, systemNotification, ReferenceDataUserResource) {
                    var authorId = systemNotification.author.id,
                        author = usersMap[authorId];

                    return author ? author : new ReferenceDataUserResource().get(authorId);
                },
                successNotificationKey: function() {
                    return 'adminSystemNotificationEdit.systemNotificationHasBeenUpdatedSuccessfully';
                },
                errorNotificationKey: function() {
                    return 'adminSystemNotificationEdit.failedToUpdateSystemNotification';
                }
            }
        });
    }

}());