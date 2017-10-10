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

describe('IsaManageController', function () {

    var $controller, $state, $rootScope, $q, isaService, notificationService, messageService, loadingModalService,
        file, vm;

    beforeEach(function() {
        module('admin-isa-manage');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $q = $injector.get('$q');
            isaService = $injector.get('isaService');
            notificationService = $injector.get('notificationService');
            messageService = $injector.get('messageService');
            loadingModalService = $injector.get('loadingModalService');
        });

        file = {
            fileName: 'file.csv',
            content: 'file-content'
        };

        vm = $controller('IsaManageController', {});

        spyOn($state, 'reload').andReturn(true);
        spyOn(loadingModalService, 'open').andReturn($q.when());
    });

    describe('init', function() {

        it('should expose getExportUrl method', function() {
            expect(angular.isFunction(vm.getExportUrl)).toBe(true);
        });

        it('should expose upload method', function() {
            expect(angular.isFunction(vm.upload)).toBe(true);
        });
    });

    describe('getExportUrl', function() {

        it('should call isaService and return download url', function() {
            var downloadUrl = "some-domain/download";
            spyOn(isaService, 'getDownloadUrl').andReturn(downloadUrl);

            var result = vm.getExportUrl();

            expect(result).toEqual(downloadUrl);
            expect(isaService.getDownloadUrl).toHaveBeenCalled();
        });
    });

    describe('upload', function() {

        var response,
            deferred;

        beforeEach(function() {
            response = {
                amount: 2
            };
            deferred = $q.defer();

            spyOn(isaService, 'upload').andReturn(deferred.promise);
            spyOn(notificationService, 'success');
            spyOn(notificationService, 'error');
        });

        it('should call isaService and show success notification', function() {
            var message = 'message';
            spyOn(messageService, 'get').andReturn(message);

            vm.file = file;
            deferred.resolve(response);

            vm.upload();
            $rootScope.$apply();

            expect(messageService.get).toHaveBeenCalledWith(
                'adminIsaManage.uploadSuccess', {
                    amount: response.amount
                });
            expect(isaService.upload).toHaveBeenCalledWith(file);
            expect(notificationService.success).toHaveBeenCalledWith(message);
            expect($state.reload).toHaveBeenCalled();
        });

        it('should show error notification if upload failed', function() {
            vm.file = file;
            deferred.reject();

            vm.upload();
            $rootScope.$apply();

            expect(isaService.upload).toHaveBeenCalledWith(file);
            expect(notificationService.error).toHaveBeenCalledWith('adminIsaManage.uploadFailed');
        });

        it('should show error notification if file is not selected', function() {
            vm.upload();

            expect(notificationService.error).toHaveBeenCalledWith('adminIsaManage.fileIsNotSelected');
            expect(isaService.upload).not.toHaveBeenCalled();
        });
    });
});
