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

describe('openlmis.administration.users.form', function() {

    var $location, $rootScope, $state, $q, MinimalFacilityDataBuilder, facilityService, UserDataBuilder, $templateCache,
        verificationEmail, authUserService, users, facilities, PageDataBuilder, VerificationEmailDataBuilder,
        UserRepository, UserService;

    beforeEach(function() {
        module('openlmis-main-state');
        module('admin-user-form');

        inject(function($injector) {
            $q = $injector.get('$q');
            $location = $injector.get('$location');
            $rootScope = $injector.get('$rootScope');
            MinimalFacilityDataBuilder = $injector.get('MinimalFacilityDataBuilder');
            facilityService = $injector.get('facilityService');
            UserDataBuilder = $injector.get('UserDataBuilder');
            $state = $injector.get('$state');
            $templateCache = $injector.get('$templateCache');
            authUserService = $injector.get('authUserService');
            PageDataBuilder = $injector.get('PageDataBuilder');
            VerificationEmailDataBuilder = $injector.get('VerificationEmailDataBuilder');
            UserService = $injector.get('UserService');
            UserRepository = $injector.get('UserRepository');
        });

        facilities = [
            new MinimalFacilityDataBuilder().build(),
            new MinimalFacilityDataBuilder().build(),
            new MinimalFacilityDataBuilder().build()
        ];

        users = new PageDataBuilder()
            .withContent([
                new UserDataBuilder().build(),
                new UserDataBuilder().build(),
                new UserDataBuilder().build()
            ])
            .build();

        verificationEmail = new VerificationEmailDataBuilder().build();

        spyOn(facilityService, 'getAllMinimal').andReturn($q.resolve(facilities));
        spyOn(UserRepository.prototype, 'query').andReturn($q.resolve(users));
        spyOn(UserService.prototype, 'get').andReturn($q.resolve(users.content[0]));
        spyOn(authUserService, 'getVerificationEmail').andReturn($q.resolve(verificationEmail));
        spyOn($templateCache, 'get').andCallThrough();
    });

    describe('state', function() {

        it('should be available under "/profile" URI', function() {
            expect($state.current.name).not.toEqual('openlmis.administration.users.form');

            goToUrl('/administration/users/form/' + users.content[0].id + '?usersPage=0&usersSize=10&sort=username');

            expect($state.current.name).toEqual('openlmis.administration.users.form');
        });

        it('should use template', function() {
            goToUrl('/administration/users/form/' + users.content[0].id + '?usersPage=0&usersSize=10&sort=username');

            expect($templateCache.get).toHaveBeenCalledWith('admin-user-form/user-form.html');
        });

        it('should resolve facilities', function() {
            goToUrl('/administration/users/form/' + users.content[0].id + '?usersPage=0&usersSize=10&sort=username');

            expect(getResolvedValue('facilities')).toEqual(facilities);
        });

        it('should resolve user', function() {
            goToUrl('/administration/users/form/' + users.content[0].id + '?usersPage=0&usersSize=10&sort=username');

            expect(getResolvedValue('user')).toEqual(users.content[0]);
            expect(UserService.prototype.get).toHaveBeenCalledWith(users.content[0].id);
        });

        it('should resolve pending email verification', function() {
            goToUrl('/administration/users/form/' + users.content[0].id + '?usersPage=0&usersSize=10&sort=username');

            expect(getResolvedValue('pendingVerificationEmail')).toEqual(verificationEmail);
        });

        it('should resolve pending verification email to undefined if creating new user', function() {
            var user = new UserDataBuilder()
                .asNew()
                .build();

            UserService.prototype.get.andReturn($q.resolve(user));

            goToUrl('/administration/users/form/' + users.content[0].id + '?usersPage=0&usersSize=10&sort=username');

            expect(getResolvedValue('pendingVerificationEmail')).toBeUndefined();
        });

    });

    function goToUrl(url) {
        $location.url(url);
        $rootScope.$apply();
    }

    function getResolvedValue(name) {
        return $state.$current.locals.globals[name];
    }

});
