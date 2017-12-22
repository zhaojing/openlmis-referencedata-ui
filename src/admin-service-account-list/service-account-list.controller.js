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
     * @ngdoc controller
     * @name admin-service-account-list.controller:ServiceAccountListController
     *
     * @description
     * Controller for managing service account list screen.
     */
    angular
        .module('admin-service-account-list')
        .controller('ServiceAccountListController', controller);

    controller.$inject = ['$state', 'serviceAccounts', 'serviceAccountService', 'confirmService', 'loadingModalService', 'notificationService', 'messageService'];

    function controller($state, serviceAccounts, serviceAccountService, confirmService, loadingModalService, notificationService, messageService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.add = add;
        vm.remove = remove;

        /**
         * @ngdoc property
         * @propertyOf admin-service-account-list.controller:ServiceAccountListController
         * @name serviceAccounts
         * @type {Array}
         *
         * @description
         * Contains page of Service Accounts.
         */
        vm.serviceAccounts = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-service-account-list.controller:ServiceAccountListController
         * @name $onInit
         *
         * @description
         * Method that is executed on initiating ServiceAccountListController.
         */
        function onInit() {
            vm.serviceAccounts = serviceAccounts;
        }

        /**
         * @ngdoc method
         * @methodOf admin-service-account-list.controller:ServiceAccountListController
         * @name add
         *
         * @description
         * Calls service to add new Service Account and reloads page.
         */
        function add() {
            confirmService.confirm('adminServiceAccount.add.question', 'adminServiceAccount.add')
            .then(function() {
                var loadingPromise = loadingModalService.open();
                serviceAccountService.create()
                .then(function(response) {
                    var successMessage = messageService.get('adminServiceAccount.add.success', {
                        key: response.token
                    });
                    loadingPromise.then(function() {
                        notificationService.success(successMessage);
                    });
                    $state.reload();
                })
                .catch(function() {
                    notificationService.error('adminServiceAccount.add.failure');
                    loadingModalService.close();
                });
            });
        }

        /**
         * @ngdoc method
         * @methodOf admin-service-account-list.controller:ServiceAccountListController
         * @name remove
         *
         * @description
         * Removes selected Service Account.
         *
         * @param {String} token the API key of selected Service Account
         */
        function remove(token) {
            var questionMessage = messageService.get('adminServiceAccount.delete.question', {
                    key: token
                }),
                failureMessage = messageService.get('adminServiceAccount.delete.failure', {
                    key: token
                }),
                successMessage = messageService.get('adminServiceAccount.delete.success', {
                    key: token
                });
            confirmService.confirm(questionMessage, 'adminServiceAccount.delete')
            .then(function() {
                var loadingPromise = loadingModalService.open();
                serviceAccountService.remove(token)
                .then(function() {
                    loadingPromise.then(function() {
                        notificationService.success(successMessage);
                    });
                    $state.reload();
                })
                .catch(function() {
                    notificationService.error(failureMessage);
                    loadingModalService.close();
                });
            });
        }
    }
})();
