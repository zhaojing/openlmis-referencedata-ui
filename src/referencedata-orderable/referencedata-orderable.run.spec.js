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

describe('referencedata-orderable run', function() {

    beforeEach(function() {
        var context = this;
        module('referencedata-orderable', function($provide) {
            context.loginServiceSpy = jasmine.createSpyObj('loginService', [
                'registerPostLoginAction', 'registerPostLogoutAction'
            ]);
            $provide.value('loginService', context.loginServiceSpy);
        });

        inject(function($injector) {
            this.$rootScope = $injector.get('$rootScope');
            this.$q = $injector.get('$q');
            this.OrderableResource = $injector.get('OrderableResource');
        });

        this.postLoginAction = getLastCall(this.loginServiceSpy.registerPostLoginAction).args[0];

        spyOn(this.OrderableResource.prototype, 'getAll');
    });

    describe('run block', function() {

        it('should register post login action', function() {
            expect(this.loginServiceSpy.registerPostLoginAction).toHaveBeenCalled();
        });

    });

    describe('post login action', function() {

        it('should clear current system notifications', function() {
            this.postLoginAction();
            this.$rootScope.$apply();

            expect(this.OrderableResource.prototype.getAll).toHaveBeenCalled();
        });

    });

    function getLastCall(method) {
        return method.calls[method.calls.length - 1];
    }

});