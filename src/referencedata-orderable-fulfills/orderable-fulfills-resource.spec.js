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

describe('OrderableFulfillsResource', function() {

    var OrderableFulfillsResource, OpenlmisResourceMock, referencedataUrlFactory, parameterSplitterMock;

    it('should extend OpenlmisResource', function() {
        module('referencedata-orderable-fulfills', function($provide) {
            OpenlmisResourceMock = jasmine.createSpy('OpenlmisResource');

            $provide.factory('OpenlmisResource', function() {
                return OpenlmisResourceMock;
            });

            $provide.factory('ParameterSplitter', function() {
                return function() {
                    parameterSplitterMock = jasmine.createSpyObj('ParameterSplitter', ['split']);
                    return parameterSplitterMock;
                };
            });
        });

        inject(function($injector) {
            referencedataUrlFactory = $injector.get('referencedataUrlFactory');
            OrderableFulfillsResource = $injector.get('OrderableFulfillsResource');
        });

        new OrderableFulfillsResource();

        expect(OpenlmisResourceMock).toHaveBeenCalledWith(
            referencedataUrlFactory('/api/orderableFulfills')
        );
    });

    ddescribe('query', function() {

        var params, responseOne, responseTwo, orderableFulfillsResource, $httpBackend, openlmisUrlFactory;

        beforeEach(function() {
            module('referencedata-orderable-fulfills', function($provide) {
                $provide.factory('ParameterSplitter', function() {
                    return function() {
                        parameterSplitterMock = jasmine.createSpyObj('ParameterSplitter', ['split']);
                        return parameterSplitterMock;
                    };
                });
            });

            inject(function($injector) {
                referencedataUrlFactory = $injector.get('referencedataUrlFactory');
                OrderableFulfillsResource = $injector.get('OrderableFulfillsResource');
                $httpBackend = $injector.get('$httpBackend');
                openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            });

            orderableFulfillsResource = new OrderableFulfillsResource();

            params = {
                some: [
                    'paramOne',
                    'paramTwo'
                ]
            };

            parameterSplitterMock.split.andReturn([{
                some: ['paramOne']
            }, {
                some: ['paramTwo']
            }]);

            responseOne = {
                idOne: ['idTwo', 'idThree']
            };

            responseTwo = {
                idFour: ['ifFive', 'idSix']
            };
        });

        it('should return response if only one request was sent', function() {
            var params = {
                some: 'param'
            };

            parameterSplitterMock.split.andReturn([params]);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/orderableFulfills?some=param'))
                .respond(200, responseOne);

            var result;
            orderableFulfillsResource.query(params)
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson(responseOne));
        });

        it('should reject if any of the requests fails', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/orderableFulfills?some=paramOne'))
                .respond(200, responseOne);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/orderableFulfills?some=paramTwo'))
                .respond(500);

            var rejected;
            orderableFulfillsResource.query(params)
            .catch(function() {
                rejected = true;
            });
            $httpBackend.flush();

            expect(rejected).toEqual(true);
        });

        iit('should return merged responses if multiple requests were sent', function() {
            $httpBackend
                .expectGET(openlmisUrlFactory('/api/orderableFulfills?some=paramOne'))
                .respond(200, responseOne);

            $httpBackend
                .expectGET(openlmisUrlFactory('/api/orderableFulfills?some=paramTwo'))
                .respond(200, responseTwo);

            var result;
            orderableFulfillsResource.query(params)
            .then(function(response) {
                result = response;
            });
            $httpBackend.flush();

            expect(angular.toJson(result)).toEqual(angular.toJson({
                idOne: ['idTwo', 'idThree'],
                idFour: ['ifFive', 'idSix']
            }));
        });

    });
});