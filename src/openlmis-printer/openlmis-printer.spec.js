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

describe('OpenlmisPrinter', function() {

    var printer, OpenlmisPrinter, accessTokenFactory, openlmisUrlFactory, messageService, $window, loadingMessageKey,
        loadingMessage, documentSpy, tabSpy, accessTokenSuffix;

    beforeEach(function() {
        module('openlmis-printer');

        inject(function($injector) {
            OpenlmisPrinter = $injector.get('OpenlmisPrinter');
            accessTokenFactory = $injector.get('accessTokenFactory');
            openlmisUrlFactory = $injector.get('openlmisUrlFactory');
            messageService = $injector.get('messageService');
            $window = $injector.get('$window');
        });

        loadingMessage = 'Loading message...';
        loadingMessageKey = 'loading.message.key';
        tabSpy = jasmine.createSpyObj('tab', ['close']);
        accessTokenSuffix = '&access_token="some-access-token';
        tabSpy.location = {};
        documentSpy = jasmine.createSpyObj('document', ['write']);
        tabSpy.document = documentSpy;

        spyOn(accessTokenFactory, 'addAccessToken');
        spyOn(messageService, 'get').andReturn(loadingMessage);
        spyOn($window, 'open').andReturn(tabSpy);
    });

    describe('constructor', function() {

        beforeEach(function() {
            printer = new OpenlmisPrinter({
                loadingMessage: loadingMessageKey,
                resourceUri: '/api/resource',
                id: '1'
            });
        });

        it('should set loadingMessage', function() {
            expect(printer.loadingMessage).toEqual(loadingMessageKey);
        });

        it('should set resource uri', function() {
            expect(printer.resourceUri).toEqual('/api/resource');
        });

        it('should set id', function() {
            expect(printer.id).toEqual('1');
        });

        it('should remove trailing slash from resource uri', function() {
            printer = new OpenlmisPrinter({
                resourceUri: '/api/resource/'
            });

            expect(printer.resourceUri).toEqual('/api/resource');
        });

        it('should default loading message to \'Loading...\'', function() {
            printer = new OpenlmisPrinter({});

            expect(printer.loadingMessage).toEqual('openlmisPrinter.loading');
        });

        it('should accept undefined', function() {
            printer = new OpenlmisPrinter();

            expect(printer.loadingMessage).toEqual('openlmisPrinter.loading');
            expect(printer.resourceUri).toBeUndefined();
            expect(printer.id).toBeUndefined();
        });
    });

    describe('openTab', function() {

        beforeEach(function() {
            printer = new OpenlmisPrinter({
                loadingMessage: loadingMessageKey
            });

            printer.openTab();
        });

        it('should open tab', function() {
            expect($window.open).toHaveBeenCalledWith('', '_blank');
        });

        it('should set a loading message', function() {
            expect(documentSpy.write).toHaveBeenCalledWith(loadingMessage);
            expect(messageService.get).toHaveBeenCalledWith(loadingMessageKey);
        });

    });

    describe('print', function() {

        beforeEach(function() {
            printer = new OpenlmisPrinter({
                resourceUri: '/api/resource',
                id: '2'
            });
            printer.openTab();

            accessTokenFactory.addAccessToken.andCallFake(function(url) {
                return url + accessTokenSuffix;
            });
        });

        it('should update tab url', function() {
            printer.print();

            expect(tabSpy.location.href).
                toEqual(openlmisUrlFactory('/api/resource/2/print?format=pdf') + accessTokenSuffix);
        });

    });

    describe('closeTab', function() {

        beforeEach(function() {
            printer = new OpenlmisPrinter();
            printer.openTab();
        });

        it('it should close tab', function() {
            printer.closeTab();

            expect(tabSpy.close).toHaveBeenCalled();
        });

    });

    describe('setId', function() {

        beforeEach(function() {
            printer = new OpenlmisPrinter();
        });

        it('should set id', function() {
            expect(printer.id).toBeUndefined();

            printer.setId('1');

            expect(printer.id).toEqual('1');
        });

    });

});