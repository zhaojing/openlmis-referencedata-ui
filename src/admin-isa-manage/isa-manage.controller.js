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
     * @name admin-isa-manage.controller:IsaManageController
     *
     * @description
     * Controller for managing Ideal Stock Amounts.
     */
    angular
        .module('admin-isa-manage')
        .controller('IsaManageController', controller);

    controller.$inject = ['$state', 'isaService', 'notificationService', 'loadingModalService', 'messageService'];

    function controller($state, isaService, notificationService, loadingModalService, messageService) {

        var vm = this;

        vm.getExportUrl = getExportUrl;
        vm.upload = upload;

        /**
         * @ngdoc property
         * @propertyOf admin-isa-manage.controller:IsaManageController
         * @name file
         * @type {Object}
         *
         * @description
         * Holds csv file.
         */
        vm.file = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-isa-manage.controller:IsaManageController
         * @name invalidMessage
         * @type {String}
         *
         * @description
         * Holds form error message.
         */
        vm.invalidMessage = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-isa-manage.controller:IsaManageController
         * @name getExportUrl
         *
         * @description
         * Returns url for downloading csv file with all ideal stock amounts.
         *
         * @return {String} url for downloading csv.
         */
        function getExportUrl() {
            return isaService.getDownloadUrl();
        }

        /**
         * @ngdoc method
         * @methodOf admin-isa-manage.controller:IsaManageController
         * @name upload
         *
         * @description
         * Uploads csv file with catalog item to the server.
         */
        function upload() {
            vm.invalidMessage = undefined;

            if (!vm.file) {
                notificationService.error('adminIsaUpload.fileIsNotSelected');
            } else {
                var loadingPromise = loadingModalService.open();
                isaService.upload(vm.file)
                .then(function(data) {
                    var message = messageService.get(
                        'adminIsaUpload.uploadSuccess',
                        {amount: data.amount}
                    );
                    loadingPromise.then(function () {
                        notificationService.success(message);
                    });

                    $state.reload();
                })
                .catch(function(error) {
                    notificationService.error('adminIsaUpload.uploadFailed');
                    vm.invalidMessage = error ? error.data.message : undefined;
                    vm.file = undefined;
                    loadingModalService.close();
                });
            }
        }
    }
})();
