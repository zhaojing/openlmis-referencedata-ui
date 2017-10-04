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

describe('userRightsRun', function() {
    var userRightsFactory, authorizationService, $rootScope, loadingService;

    beforeEach(module('openlmis-permissions'));

    beforeEach(inject(function($injector, $q) {
        $rootScope = $injector.get('$rootScope');

        userRightsFactory = $injector.get('userRightsFactory');
        spyOn(userRightsFactory, 'buildRights').andReturn($q.resolve());

        authorizationService = $injector.get('authorizationService');
        spyOn(authorizationService, 'setRights');
        spyOn(authorizationService, 'clearRights');

        loadingService = $injector.get('loadingService');
        spyOn(loadingService, 'register').andCallThrough();
    }));

    beforeEach(inject(function($q) {
        
    }));

    it('on openlmis-auth.login builds userRights', function() {
        $rootScope.$emit('openlmis-auth.login');

        expect(userRightsFactory.buildRights).toHaveBeenCalled();
    });
    
    it('on openlmis-auth.login stores userRights to authorizationService', function() {
        $rootScope.$emit('openlmis-auth.login');
        $rootScope.$apply(); // makes buildRights resolve

        expect(authorizationService.setRights).toHaveBeenCalled();
    });

    it('should not load rights if there was an error building rights', inject(function($q) {
        userRightsFactory.buildRights.andReturn($q.reject());

        $rootScope.$emit('openlmis-auth.login');
        $rootScope.$apply();

        expect(authorizationService.setRights).not.toHaveBeenCalled();
    }));

    it('on openlmis-auth.login registers with loadingService', function() {
        $rootScope.$emit('openlmis-auth.login');

        expect(loadingService.register).toHaveBeenCalled();
        expect(loadingService.register.mostRecentCall.args[0]).toBe('openlmis-permissions.getRights');
    });

    it('should change loadingService loading state as rights are stored', function() {
        $rootScope.$emit('openlmis-auth.login');

        expect(loadingService.isLoading()).toBe(true);

        $rootScope.$apply();

        expect(loadingService.isLoading()).toBe(false);
    });

    it('on openlmis-auth.logout clears rights from authorizationService', function() {
        $rootScope.$emit('openlmis-auth.logout');

        expect(authorizationService.clearRights).toHaveBeenCalled();
    });

});
