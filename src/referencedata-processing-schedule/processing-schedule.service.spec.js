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

describe('processingScheduleService', function() {

    var $rootScope, $httpBackend, referencedataUrlFactory, processingScheduleService, ProcessingScheduleDataBuilder,
        processingSchedules;

    beforeEach(function() {
        module('referencedata-processing-schedule');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            processingScheduleService = $injector.get('processingScheduleService');
            ProcessingScheduleDataBuilder = $injector.get('ProcessingScheduleDataBuilder');
        });

        processingSchedules = [
            new ProcessingScheduleDataBuilder().build(),
            new ProcessingScheduleDataBuilder().build()
        ];
    });

    describe('get', function() {

        it('should get processing schedule by id', function() {
            var data;

            $httpBackend.when('GET', referencedataUrlFactory('/api/processingSchedules/' + processingSchedules[0].id))
                .respond(200, processingSchedules[0]);

            processingScheduleService.get(processingSchedules[0].id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.id).toBe(processingSchedules[0].id);
        });
    });

    describe('query', function() {

        it('should get all processing periods', function() {
            var data,
                parameters = {
                    param: 'value'
                };

            $httpBackend.when('GET', referencedataUrlFactory('/api/processingSchedules?param=' + parameters.param))
                .respond(200, {
                    content: processingSchedules
                });

            processingScheduleService.query(parameters).then(function(response) {
                data = response.content;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.length).toEqual(2);
            expect(data[0].id).toBe(processingSchedules[0].id);
            expect(data[1].id).toBe(processingSchedules[1].id);
        });
    });

    describe('create', function() {

        it('should create new processing period', function() {
            var data;

            $httpBackend.expectPOST(referencedataUrlFactory('/api/processingSchedules'), processingSchedules[0])
                .respond(200, processingSchedules[0]);

            processingScheduleService.create(processingSchedules[0]).then(function(response) {
                data = response;
            });
            $httpBackend.flush();
            $rootScope.$apply();

            expect(data.name).toEqual(processingSchedules[0].name);
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
