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

describe('user cache run', function() {
    var referencedataUserService, $q, $rootScope, loadingService, permissionService, user;

    beforeEach(function() {
        module('referencedata-user-cache');

        inject(function($injector) {
            loadingService = $injector.get('loadingService');
            permissionService = $injector.get('permissionService');
            $q = $injector.get('$q');
            $rootScope = $injector.get('$rootScope');
            referencedataUserService = $injector.get('referencedataUserService');
        });

        spyOn(permissionService, 'load').andReturn($q.resolve(true));

        user = {
            user_id: 'user-id',
            username: 'some-user'
        };
    });

    it('should cache user on login', function() {
        var promise = $q.when(user);
        spyOn(referencedataUserService, 'getCurrentUserInfo').andReturn(promise);
        spyOn(loadingService, 'register');

        $rootScope.$emit('openlmis-auth.login');
        $rootScope.$apply();

        expect(referencedataUserService.getCurrentUserInfo).toHaveBeenCalled();
        expect(loadingService.register).toHaveBeenCalledWith('referencedata-user-cache.loading', promise);
    });

    it('should clear user cache on logout', function() {
        spyOn(referencedataUserService, 'clearUserCache');

        $rootScope.$emit('openlmis-auth.logout');
        $rootScope.$apply();

        expect(referencedataUserService.clearUserCache).toHaveBeenCalled();
    });
});
