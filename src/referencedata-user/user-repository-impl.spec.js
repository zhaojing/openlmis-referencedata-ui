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

ddescribe('UserRepositoryImpl', function() {

    var userRepositoryImpl, UserRepositoryImpl, UserDataBuilder, referenceDataUserResourceMock, authUserResourceMock,
        userContactDetailsResourceMock, userDataBuilder, $q, $rootScope, user, userBuilders, expected, PageDataBuilder,
        page;

    beforeEach(function() {
        module('openlmis-pagination');
        module('referencedata-user', function($provide) {
            referenceDataUserResourceMock = jasmine.createSpyObj('referenceDataUserResource', [
                'update', 'get', 'query'
            ]);
            $provide.factory('ReferenceDataUserResource', function() {
                return function() {
                    return referenceDataUserResourceMock;
                };
            });

            authUserResourceMock = jasmine.createSpyObj('authUserResource', ['create']);
            $provide.factory('AuthUserResource', function() {
                return function() {
                    return authUserResourceMock;
                };
            });

            userContactDetailsResourceMock = jasmine.createSpyObj('userContactDetailsResource', [
                'update', 'get', 'query'
            ]);
            $provide.factory('UserContactDetailsResource', function() {
                return function() {
                    return userContactDetailsResourceMock;
                };
            });
        });

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            UserDataBuilder = $injector.get('UserDataBuilder');
            UserRepositoryImpl = $injector.get('UserRepositoryImpl');
            PageDataBuilder = $injector.get('PageDataBuilder');
        });

        userDataBuilder = new UserDataBuilder().asNew();

        user = userDataBuilder.build();

        userBuilders = [
            new UserDataBuilder(),
            new UserDataBuilder(),
            new UserDataBuilder(),
            new UserDataBuilder()
        ];

        userDataBuilder.withId('some-id');
        expected = userDataBuilder.build();

        authUserResourceMock.create.andReturn($q.resolve(userDataBuilder.buildAuthUserJson()));

        referenceDataUserResourceMock.update.andReturn($q.resolve(userDataBuilder.buildReferenceDataUserJson()));
        referenceDataUserResourceMock.get.andReturn($q.resolve(userDataBuilder.buildReferenceDataUserJson()));

        userContactDetailsResourceMock.update.andReturn($q.resolve(userDataBuilder.buildUserContactDetailsJson()));
        userContactDetailsResourceMock.get.andReturn($q.resolve(userDataBuilder.buildUserContactDetailsJson()));

        userRepositoryImpl = new UserRepositoryImpl();
    });

    describe('create', function() {

        it('should create reference data user before creating contact and auth details', function() {
            var referenceDataUserUpdateDeferred = $q.defer();
            referenceDataUserResourceMock.update.andReturn(referenceDataUserUpdateDeferred.promise);

            userRepositoryImpl.create(user);

            expect(referenceDataUserResourceMock.update).toHaveBeenCalledWith(user.getBasicInformation());
            expect(authUserResourceMock.create).not.toHaveBeenCalled();
            expect(userContactDetailsResourceMock.update).not.toHaveBeenCalled();

            referenceDataUserUpdateDeferred.resolve(userDataBuilder.buildReferenceDataUserJson());
            $rootScope.$apply();

            expect(authUserResourceMock.create).toHaveBeenCalledWith(expected.getAuthDetails());
            expect(userContactDetailsResourceMock.update).toHaveBeenCalledWith(expected.getContactDetails());
        });

        it('should return user json', function() {
            var result;
            userRepositoryImpl.create(user)
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(userDataBuilder.buildJson());
        });

        it('should reject if reference data user creation failed', function() {
            referenceDataUserResourceMock.update.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.create(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if auth data user creation failed', function() {
            authUserResourceMock.create.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.create(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if reference data user creation failed', function() {
            userContactDetailsResourceMock.update.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.create(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

    describe('update', function() {

        beforeEach(function() {
            user = userDataBuilder.build();
        });

        it('should return user json', function() {
            var result;
            userRepositoryImpl.update(user)
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(userDataBuilder.buildJson());
            expect(referenceDataUserResourceMock.update).toHaveBeenCalledWith(expected.getBasicInformation());
            expect(userContactDetailsResourceMock.update).toHaveBeenCalledWith(expected.getContactDetails());
        });

        it('should reject if reference data user creation failed', function() {
            referenceDataUserResourceMock.update.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.update(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if reference data user creation failed', function() {
            userContactDetailsResourceMock.update.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.update(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

    describe('get', function() {

        beforeEach(function() {
            user = userDataBuilder.build();
        });

        it('should return user json', function() {
            var result;
            userRepositoryImpl.get(user.id)
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(userDataBuilder.buildJson());
            expect(referenceDataUserResourceMock.get).toHaveBeenCalledWith(user.id);
            expect(userContactDetailsResourceMock.get).toHaveBeenCalledWith(user.id);
        });

        it('should reject if reference data user creation failed', function() {
            referenceDataUserResourceMock.get.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.get(user.id)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if reference data user creation failed', function() {
            userContactDetailsResourceMock.get.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.get(user.id)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

    describe('query', function() {

        beforeEach(function() {
            referenceDataUserResourceMock.query.andReturn($q.resolve(
                new PageDataBuilder()
                    .withContent([
                        userBuilders[0].buildReferenceDataUserJson(),
                        userBuilders[1].buildReferenceDataUserJson(),
                        userBuilders[2].buildReferenceDataUserJson()
                    ])
                    .build()
            ));

            userContactDetailsResourceMock.query.andReturn($q.resolve(
                new PageDataBuilder()
                    .withContent([
                        userBuilders[0].buildUserContactDetailsJson(),
                        userBuilders[1].buildUserContactDetailsJson(),
                        userBuilders[2].buildUserContactDetailsJson()
                    ])
                    .build()
            ));
        });

        it('should fetch user contact details first if searching by email', function() {
            referenceDataUserResourceMock.query.andReturn($q.resolve(
                new PageDataBuilder()
                    .withContent([
                        userBuilders[0].buildReferenceDataUserJson(),
                        userBuilders[1].buildReferenceDataUserJson()
                    ])
                    .build()
            ));

            var result,
                params = {
                    email: 'jack.smith@opelmis.com',
                    username: 'user'
                };

            userRepositoryImpl.query(params).then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content).toEqual([
                userBuilders[0].buildJson(),
                userBuilders[1].buildJson()
            ]);
            expect(userContactDetailsResourceMock.query).toHaveBeenCalledWith({
                email: 'jack.smith@opelmis.com'
            });
            expect(referenceDataUserResourceMock.query).toHaveBeenCalledWith({
                email: 'jack.smith@opelmis.com',
                username: 'user',
                id: [
                    userBuilders[0].id,
                    userBuilders[1].id,
                    userBuilders[2].id
                ]
            });
        });

        it('should not call reference data if there are no matching contact details', function() {
            userContactDetailsResourceMock.query.andReturn($q.resolve(new PageDataBuilder().build()));

            var result,
                params = {
                    email: 'jack.smith@opelmis.com',
                    username: 'user'
                };

            userRepositoryImpl.query(params).then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content).toEqual([]);
            expect(userContactDetailsResourceMock.query).toHaveBeenCalledWith({
                email: 'jack.smith@opelmis.com'
            });
            expect(referenceDataUserResourceMock.query).not.toHaveBeenCalled();
        });

        it('should fetch referencedata user first if email is not specified', function() {
            var result,
                params = {
                    username: 'user'
                };

            userRepositoryImpl.query(params).then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content).toEqual([
                userBuilders[0].buildJson(),
                userBuilders[1].buildJson(),
                userBuilders[2].buildJson()
            ]);
            expect(referenceDataUserResourceMock.query).toHaveBeenCalledWith({
                username: 'user'
            });
            expect(userContactDetailsResourceMock.query).toHaveBeenCalledWith({
                id: [
                    userBuilders[0].id,
                    userBuilders[1].id,
                    userBuilders[2].id
                ]
            });
        });

        it('should not call notification if there are no matching users', function() {
            referenceDataUserResourceMock.query.andReturn($q.resolve(new PageDataBuilder().build()));

            var result,
                params = {
                    username: 'user'
                };

            userRepositoryImpl.query(params).then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content).toEqual([]);
            expect(referenceDataUserResourceMock.query).toHaveBeenCalledWith({
                username: 'user'
            });
            expect(userContactDetailsResourceMock.query).not.toHaveBeenCalled();
        });

        it('should reference data user if there is no contact details', function() {
            userContactDetailsResourceMock.query.andReturn($q.resolve(
                new PageDataBuilder()
                    .withContent([
                        userBuilders[0].buildUserContactDetailsJson(),
                        userBuilders[1].buildUserContactDetailsJson()
                    ])
                    .build()
            ));

            var result,
                params = {
                    username: 'user'
                };

            userRepositoryImpl.query(params).then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content).toEqual([
                userBuilders[0].buildJson(),
                userBuilders[1].buildJson(),
                userBuilders[2].buildReferenceDataUserJson()
            ]);
            expect(referenceDataUserResourceMock.query).toHaveBeenCalledWith({
                username: 'user'
            });
            expect(userContactDetailsResourceMock.query).toHaveBeenCalledWith({
                id: [
                    userBuilders[0].id,
                    userBuilders[1].id,
                    userBuilders[2].id
                ]
            });
        });

        it('should reject if reference data rejects', function() {
            referenceDataUserResourceMock.query.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.query()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if notification rejects', function() {
            userContactDetailsResourceMock.query.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.query()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

    });

});