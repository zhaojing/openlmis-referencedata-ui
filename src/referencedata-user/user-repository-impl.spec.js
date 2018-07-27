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

describe('UserRepositoryImpl', function() {

    var userRepositoryImpl, UserRepositoryImpl, UserDataBuilder, userDataBuilder, $q, $rootScope, user, userBuilders,
        expected, PageDataBuilder, ReferenceDataUserResource, AuthUserResource, UserContactDetailsResource;

    beforeEach(function() {
        module('openlmis-pagination');
        module('referencedata-user');

        inject(function($injector) {
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            UserDataBuilder = $injector.get('UserDataBuilder');
            UserRepositoryImpl = $injector.get('UserRepositoryImpl');
            PageDataBuilder = $injector.get('PageDataBuilder');
            ReferenceDataUserResource = $injector.get('ReferenceDataUserResource');
            AuthUserResource = $injector.get('AuthUserResource');
            UserContactDetailsResource = $injector.get('UserContactDetailsResource');
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

        spyOn(AuthUserResource.prototype, 'create').andReturn($q.resolve(userDataBuilder.buildAuthUserJson()));

        spyOn(ReferenceDataUserResource.prototype, 'query');
        spyOn(ReferenceDataUserResource.prototype, 'update')
            .andReturn($q.resolve(userDataBuilder.buildReferenceDataUserJson()));
        spyOn(ReferenceDataUserResource.prototype, 'get')
            .andReturn($q.resolve(userDataBuilder.buildReferenceDataUserJson()));

        spyOn(UserContactDetailsResource.prototype, 'query');
        spyOn(UserContactDetailsResource.prototype, 'update')
            .andReturn($q.resolve(userDataBuilder.buildUserContactDetailsJson()));

        userRepositoryImpl = new UserRepositoryImpl();
    });

    describe('create', function() {

        it('should create reference data user before creating contact and auth details', function() {
            var referenceDataUserUpdateDeferred = $q.defer();
            ReferenceDataUserResource.prototype.update.andReturn(referenceDataUserUpdateDeferred.promise);

            userRepositoryImpl.create(user);

            expect(ReferenceDataUserResource.prototype.update).toHaveBeenCalledWith(user.getBasicInformation());
            expect(AuthUserResource.prototype.create).not.toHaveBeenCalled();
            expect(UserContactDetailsResource.prototype.update).not.toHaveBeenCalled();

            referenceDataUserUpdateDeferred.resolve(userDataBuilder.buildReferenceDataUserJson());
            $rootScope.$apply();

            expect(AuthUserResource.prototype.create).toHaveBeenCalledWith(expected.getAuthDetails());
            expect(UserContactDetailsResource.prototype.update).toHaveBeenCalledWith(expected.getContactDetails());
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
            ReferenceDataUserResource.prototype.update.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.create(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if auth data user creation failed', function() {
            AuthUserResource.prototype.create.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.create(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if reference data user creation failed', function() {
            UserContactDetailsResource.prototype.update.andReturn($q.reject());

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
            expect(ReferenceDataUserResource.prototype.update).toHaveBeenCalledWith(expected.getBasicInformation());
            expect(UserContactDetailsResource.prototype.update).toHaveBeenCalledWith(expected.getContactDetails());
        });

        it('should reject if reference data user creation failed', function() {
            ReferenceDataUserResource.prototype.update.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.update(user)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if reference data user creation failed', function() {
            UserContactDetailsResource.prototype.update.andReturn($q.reject());

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
            UserContactDetailsResource.prototype.query.andReturn($q.resolve(
                new PageDataBuilder()
                    .withContent([userDataBuilder.buildUserContactDetailsJson()])
                    .build()
            ));
        });

        it('should return user json', function() {
            var result;
            userRepositoryImpl.get(user.id)
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(userDataBuilder.buildJson());
            expect(ReferenceDataUserResource.prototype.get).toHaveBeenCalledWith(user.id);
            expect(UserContactDetailsResource.prototype.query).toHaveBeenCalledWith({
                id: [user.id]
            });
        });

        it('should reject if reference data user creation failed', function() {
            ReferenceDataUserResource.prototype.get.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.get(user.id)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if reference data user creation failed', function() {
            UserContactDetailsResource.prototype.query.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.get(user.id)
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should return user without contact details if they does not exist', function() {
            UserContactDetailsResource.prototype.query.andReturn($q.resolve(new PageDataBuilder().build()));

            var result;
            userRepositoryImpl.get(user.id)
                .then(function(user) {
                    result = user;
                });
            $rootScope.$apply();

            expect(result).toEqual(
                userDataBuilder
                    .withoutContactDetails()
                    .buildJson()
            );
        });

    });

    describe('query', function() {

        beforeEach(function() {
            ReferenceDataUserResource.prototype.query.andReturn($q.resolve(
                new PageDataBuilder()
                    .withContent([
                        userBuilders[0].buildReferenceDataUserJson(),
                        userBuilders[1].buildReferenceDataUserJson(),
                        userBuilders[2].buildReferenceDataUserJson()
                    ])
                    .build()
            ));

            UserContactDetailsResource.prototype.query.andReturn($q.resolve(
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
            ReferenceDataUserResource.prototype.query.andReturn($q.resolve(
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
            expect(UserContactDetailsResource.prototype.query).toHaveBeenCalledWith({
                email: 'jack.smith@opelmis.com'
            });
            expect(ReferenceDataUserResource.prototype.query).toHaveBeenCalledWith({
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
            UserContactDetailsResource.prototype.query.andReturn($q.resolve(new PageDataBuilder().build()));

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
            expect(UserContactDetailsResource.prototype.query).toHaveBeenCalledWith({
                email: 'jack.smith@opelmis.com'
            });
            expect(ReferenceDataUserResource.prototype.query).not.toHaveBeenCalled();
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
            expect(ReferenceDataUserResource.prototype.query).toHaveBeenCalledWith({
                username: 'user'
            });
            expect(UserContactDetailsResource.prototype.query).toHaveBeenCalledWith({
                id: [
                    userBuilders[0].id,
                    userBuilders[1].id,
                    userBuilders[2].id
                ]
            });
        });

        it('should not call notification if there are no matching users', function() {
            ReferenceDataUserResource.prototype.query.andReturn($q.resolve(new PageDataBuilder().build()));

            var result,
                params = {
                    username: 'user'
                };

            userRepositoryImpl.query(params).then(function(page) {
                result = page;
            });
            $rootScope.$apply();

            expect(result.content).toEqual([]);
            expect(ReferenceDataUserResource.prototype.query).toHaveBeenCalledWith({
                username: 'user'
            });
            expect(UserContactDetailsResource.prototype.query).not.toHaveBeenCalled();
        });

        it('should reference data user if there is no contact details', function() {
            UserContactDetailsResource.prototype.query.andReturn($q.resolve(
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
            expect(ReferenceDataUserResource.prototype.query).toHaveBeenCalledWith({
                username: 'user'
            });
            expect(UserContactDetailsResource.prototype.query).toHaveBeenCalledWith({
                id: [
                    userBuilders[0].id,
                    userBuilders[1].id,
                    userBuilders[2].id
                ]
            });
        });

        it('should reject if reference data rejects', function() {
            ReferenceDataUserResource.prototype.query.andReturn($q.reject());

            var rejected;
            userRepositoryImpl.query()
                .catch(function() {
                    rejected = true;
                });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
        });

        it('should reject if notification rejects', function() {
            UserContactDetailsResource.prototype.query.andReturn($q.reject());

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