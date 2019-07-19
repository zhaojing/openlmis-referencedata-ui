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

    beforeEach(function() {
        module('referencedata-processing-schedule');

        inject(function($injector) {
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            this.processingScheduleService = $injector.get('processingScheduleService');
            this.ProcessingScheduleDataBuilder = $injector.get('ProcessingScheduleDataBuilder');
            this.PageDataBuilder = $injector.get('PageDataBuilder');
        });

        this.processingSchedule = new this.ProcessingScheduleDataBuilder().build();

        this.processingSchedules = [
            this.processingSchedule,
            new this.ProcessingScheduleDataBuilder().build()
        ];

        this.processingSchedulesPage = new this.PageDataBuilder()
            .withContent(this.processingSchedules)
            .build();
    });

    describe('get', function() {

        it('should get processing schedule by id', function() {
            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/processingSchedules/' + this.processingSchedule.id))
                .respond(200, this.processingSchedule);

            var result;
            this.processingScheduleService
                .get(this.processingSchedule.id)
                .then(function(processingSchedule) {
                    result = processingSchedule;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.processingSchedule));
        });
    });

    describe('query', function() {

        it('should get all processing periods', function() {
            var parameters = {
                param: 'value'
            };

            this.$httpBackend
                .expectGET(this.referencedataUrlFactory('/api/processingSchedules?param=' + parameters.param))
                .respond(200, this.processingSchedulesPage);

            var result;
            this.processingScheduleService
                .query(parameters)
                .then(function(processingSchedulesPage) {
                    result = processingSchedulesPage;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.processingSchedulesPage));
        });
    });

    describe('create', function() {

        it('should create new processing period', function() {
            this.$httpBackend
                .expectPOST(this.referencedataUrlFactory('/api/processingSchedules'), this.processingSchedule)
                .respond(200, this.processingSchedule);

            var result;
            this.processingScheduleService
                .create(this.processingSchedule)
                .then(function(response) {
                    result = response;
                });
            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result)).toEqual(angular.toJson(this.processingSchedule));
        });
    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
