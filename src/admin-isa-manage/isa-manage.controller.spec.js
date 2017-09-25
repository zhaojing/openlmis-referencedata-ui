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

    var $controller, isaService, vm;

    beforeEach(function() {
        module('admin-isa-manage');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            isaService = $injector.get('isaService');
        });

        vm = $controller('IsaManageController', {});
    });

    describe('init', function() {

        it('should expose getExportUrl method', function() {
            expect(angular.isFunction(vm.getExportUrl)).toBe(true);
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
});
