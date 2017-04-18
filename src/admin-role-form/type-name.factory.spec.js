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
describe('typeNameFactory', function() {

    var typeNameFactory, messageService, type, typeLabel, typeDescription;

    beforeEach(function() {
        module('admin-role-form');

        inject(function($injector) {
            typeNameFactory = $injector.get('typeNameFactory');
            messageService = $injector.get('messageService');
        });

        typeLabel = 'Some awesome type name';
        typeDescription = 'Some not so short, but maybe a little, description';
        type = 'SOME_AWESOME_TYPE_NAME';
        right = 'SOME_RIGHT_NAME';
        rightMessage = 'Some right';

        spyOn(messageService, 'get').andCallFake(function(key) {
            if (key === 'adminRoleForm.someAwesomeTypeName.label') return typeLabel;
            if (key === 'adminRoleForm.someAwesomeTypeName.description') return typeDescription;
            if (key === 'adminRoleForm.someRightName') return rightMessage;
        });
    });

    describe('getLabel', function() {

        it('should return localized message', function() {
            var result = typeNameFactory.getLabel(type);

            expect(result).toEqual(typeLabel);
        });

        it('should build label key', function() {
            typeNameFactory.getLabel(type);

            expect(messageService.get).toHaveBeenCalledWith('adminRoleForm.someAwesomeTypeName.label');
        });

    });

    describe('getDescription', function() {

        it('should return localized message', function() {
            var result = typeNameFactory.getDescription(type);

            expect(result).toEqual(typeDescription);
        });

        it('should build label key', function() {
            typeNameFactory.getDescription(type);

            expect(messageService.get).toHaveBeenCalledWith('adminRoleForm.someAwesomeTypeName.description');
        });

    });

    describe('getMessage', function() {

        it('should return localized message', function() {
            var result = typeNameFactory.getMessage(right);

            expect(result).toEqual(rightMessage);
        });

        it('should build label key', function() {
            typeNameFactory.getMessage(right);

            expect(messageService.get).toHaveBeenCalledWith('adminRoleForm.someRightName');
        });

    });


});
