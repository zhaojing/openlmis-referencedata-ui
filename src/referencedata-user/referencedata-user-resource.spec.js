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

describe('ReferenceDataUserResource', function() {

    var referenceDataUserResource, ReferenceDataUserResource, $httpBackend, $rootScope, PageDataBuilder, page,
        parameterSplitterMock, openlmisUrlFactory;

    beforeEach(function() {
        module('openlmis-pagination');
        module('referencedata-user', function($provide) {
            $provide.factory('ParameterSplitter', function() {
                return function() {
                    parameterSplitterMock = jasmine.createSpyObj('ParameterSplitter', ['split']);
                    return parameterSplitterMock;
                };
            });
        });

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            ReferenceDataUserResource = $injector.get('ReferenceDataUserResource');
            PageDataBuilder = $injector.get('PageDataBuilder');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
        });

        referenceDataUserResource = new ReferenceDataUserResource();

        page = new PageDataBuilder().build();
    });

    describe('query', function() {

        var params, pageTwo;

        beforeEach(function() {
            referenceDataUserResource = new ReferenceDataUserResource();

            parameterSplitterMock.split.andReturn([{
                some: ['paramOne']
            }, {
                some: ['paramTwo']
            }]);

            page = PageDataBuilder.buildWithContent([{
                id: 'obj-one'
            }, {
                id: 'obj-two'
            }]);

            pageTwo = PageDataBuilder.buildWithContent([{
                id: 'obj-three'
            }, {
                id: 'obj-four'
            }]);
        });

        it('should return page if only one request was sent', function() {
            var params = {
                some: 'param'
            };

            parameterSplitterMock.split.andReturn([params]);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users?some=param'))
                .respond(200, page);

            var result;
            referenceDataUserResource.query(params)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(page));
        });

        it('should reject if any of the requests fails', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users?some=paramOne'))
                .respond(200, page);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users?some=paramTwo'))
                .respond(500);

            var rejected;
            referenceDataUserResource.query(params)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should return merged page if multiple requests were sent', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users?some=paramOne'))
                .respond(200, page);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users?some=paramTwo'))
                .respond(200, pageTwo);

            var result;
            referenceDataUserResource.query(params)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(result.content).toEqual([page.content[0], page.content[1], pageTwo.content[0], pageTwo.content[1]]);
            expect(result.numberOfElements).toEqual(4);
            expect(result.totalElements).toEqual(4);
            expect(result.size).toEqual(page.size);
        });

        it('should return response if params are not defined', function() {
            parameterSplitterMock.split.andReturn([undefined]);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users'))
                .respond(200, page);

            var result;
            referenceDataUserResource.query()
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(page));
        });

    });

    describe('get', function() {

        var response;

        beforeEach(function() {
            response = {
                id: 'some-id',
                some: 'test-object'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users/' + response.id))
                .respond(200, response);

            var result;
            referenceDataUserResource.get(response.id)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(response));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/users/' + response.id))
                .respond(400);

            var rejected;
            referenceDataUserResource.get(response.id)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            referenceDataUserResource.get()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('create', function() {

        var response, object;

        beforeEach(function() {
            response = {
                id: 'some-id',
                some: 'test-response'
            };

            object = {
                some: 'test-response'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectPOST(openlmisUrlFactory('/api/users'), object)
                .respond(200, response);

            var result;
            referenceDataUserResource.create(object)
                .then(function(response) {
                    result = response;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(response));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectPOST(openlmisUrlFactory('/api/users'), object)
                .respond(400);

            var rejected;
            referenceDataUserResource.create(object)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            referenceDataUserResource.create()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('update', function() {

        var object;

        beforeEach(function() {
            object = {
                id: 'some-id',
                some: 'test-response',
                customId: 'custom-id-value'
            };
        });

        it('should resolve to server response on successful request', function() {
            $httpBackend
                .expectPUT(openlmisUrlFactory('/api/users'), object)
                .respond(200, object);

            var result;
            referenceDataUserResource.update(object)
                .then(function(object) {
                    result = object;
                });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(object));
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectPUT(openlmisUrlFactory('/api/users'), object)
                .respond(400);

            var rejected;
            referenceDataUserResource.update(object)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            referenceDataUserResource.update()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    describe('delete', function() {

        var object;

        beforeEach(function() {
            object = {
                id: 'some-id',
                some: 'test-object',
                customId: 'custom-id-value'
            };
        });

        it('should resolve on successful request', function() {
            $httpBackend
                .expectDELETE(openlmisUrlFactory('/api/users/' + object.id))
                .respond(200);

            var resolved;
            referenceDataUserResource.delete(object)
                .then(function() {
                    resolved = true;
                });
            $httpBackend.flush();

            expect(resolved).toEqual(true);
        });

        it('should reject on failed request', function() {
            $httpBackend
                .expectDELETE(openlmisUrlFactory('/api/users/' + object.id))
                .respond(400);

            var rejected;
            referenceDataUserResource.delete(object)
                .catch(function() {
                    rejected = true;
                });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        it('should reject if null was given', function() {
            var rejected;
            referenceDataUserResource.delete()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toBe(true);
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

});
