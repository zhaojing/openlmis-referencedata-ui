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

describe('referencedataUserService', function() {

    var $rootScope, $httpBackend, openlmisUrlFactory, userOne, userTwo, referencedataUserService,
        User, UserDataBuilder;

    beforeEach(function() {
        module('referencedata-user');

        inject(function($injector) {
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            referencedataUserService = $injector.get('referencedataUserService');
            User = $injector.get('User');
            UserDataBuilder = $injector.get('UserDataBuilder');
        });

        userOne = new UserDataBuilder().build();
        userTwo = new UserDataBuilder().build();
    });

    describe('get', function() {

        var data;

        beforeEach(function() {
            $httpBackend
            .whenGET(openlmisUrlFactory('/api/users/' + userOne.id))
            .respond(200, userOne);
        });

        it('should get user by id', function() {

            referencedataUserService.get(userOne.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(angular.toJson(data)).toEqual(angular.toJson(userOne));
        });

        it('should return an instance of ', function() {
            referencedataUserService.get(userOne.id).then(function(response) {
                data = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(data instanceof User).toBe(true);
        });
    });

    it('should get all users', function() {
        var data;

        $httpBackend.when('GET', openlmisUrlFactory('/api/users'))
            .respond(200, {content: [userOne, userTwo]});

        referencedataUserService.query().then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.content[0].id).toEqual(userOne.id);
        expect(data.content[1].id).toEqual(userTwo.id);
    });

    it('should get all users by id with pagination params', function() {
        var data,
            idOne = "id-one",
            idTwo = "id-two",
            params = {
                id: [idOne, idTwo],
                page: 0,
                size: 10,
                sort: "username"
            };

        var url = openlmisUrlFactory('/api/users?id=' + idOne + '&id=' + idTwo +
            '&page=' + params.page + '&size=' + params.size + '&sort=' + params.sort);
        $httpBackend
            .when('GET', url)
            .respond(200, {content: [userOne, userTwo]});

        referencedataUserService.query(params).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.content[0].id).toEqual(userOne.id);
        expect(data.content[1].id).toEqual(userTwo.id);
    });

    it('should search for users', function() {
        var data,
        params = {
            param: 'param',
            page: 0,
            size: 10,
            sort: "username"
        };

        $httpBackend.when('POST', openlmisUrlFactory('/api/users/search?page=' + params.page +
        '&size=' + params.size +
        '&sort=' + params.sort))
        .respond(function(method, url, data) {
            if(!angular.equals(data, angular.toJson({
                param: 'param'
            }))){
                return [404];
            } else {
                return [200, angular.toJson(userOne)];
            }
        });

        referencedataUserService.search(params).then(function(response) {
            data = response;
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(data.id).toEqual(userOne.id);
    });

    describe('saveUser', function() {

        var user, userResponse;

        beforeEach(function() {
            user = {
                username: "johndoe1",
                firstName: "John",
                lastName: "Doe",
                email: "johndoe1@gmail.com",
                loginRestricted: false
            };

            userResponse = {
                username: 'johndoe1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'johndoe1@gmail.com',
                verified: false,
                active: false,
                loginRestricted: false,
                allowNotify: true,
                roleAssignments: [],
                id: 'c9d89cf5-5b79-4ee8-a750-85bcdb94b9e3'
            };

            $httpBackend.whenPUT(openlmisUrlFactory('/api/users'), user).respond(200, userResponse);
        });

        it('should send request', function() {
            $httpBackend.expectPUT(openlmisUrlFactory('/api/users'), user, {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8'
            });

            referencedataUserService.saveUser(user);
            $httpBackend.flush();
            $rootScope.$apply();
        });

        it('should return promise', function() {
            var result = referencedataUserService.saveUser(user);
            $httpBackend.flush();
            $rootScope.$apply();

            expect(result.then).not.toBeUndefined();
        });

        it('should return promise that resolves to user', function() {
            var result;

            referencedataUserService.saveUser(user).then(function(response) {
                result = response;
            });

            $httpBackend.flush();
            $rootScope.$apply();

            expect(result).not.toBeUndefined();
            angular.forEach(result, function(value, key) {
                if (key !== '$promise' && key !== '$resolved') {
                    expect(value).toEqual(userResponse[key]);
                }
            });
            angular.forEach(userResponse, function(value, key) {
                expect(value).toEqual(result[key]);
            });
        });

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });
});
