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

describe('OrderableEditProgramsController', function() {

    beforeEach(function() {
        module('admin-orderable-edit', function($provide) {
            $provide.service('notificationService', function() {
                return jasmine.createSpyObj('notificationService', ['success', 'error']);
            });
        });

        inject(function($injector) {
            this.$controller = $injector.get('$controller');
            this.confirmService = $injector.get('confirmService');
            this.$state = $injector.get('$state');
            this.OrderableDataBuilder = $injector.get('OrderableDataBuilder');
            this.OrderableResource = $injector.get('OrderableResource');
            this.$q = $injector.get('$q');
            this.$rootScope = $injector.get('$rootScope');
            this.ProgramDataBuilder = $injector.get('ProgramDataBuilder');
        });

        this.orderable = new this.OrderableDataBuilder().buildJson();

        this.programs = [
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build(),
            new this.ProgramDataBuilder().build()
        ];

        this.programsMap = {};
        this.programsMap[this.programs[0].id] = this.programs[0];
        this.programsMap[this.programs[1].id] = this.programs[1];
        this.programsMap[this.programs[2].id] = this.programs[2];

        spyOn(this.$state, 'go');
        spyOn(this.OrderableResource.prototype, 'update').andReturn(this.$q.resolve(this.orderable));

        this.vm = this.$controller('OrderableEditProgramsController', {
            orderable: this.orderable,
            programsMap: this.programsMap
        });
        this.vm.$onInit();
    });

    describe('onInit', function() {

        it('should expose orderable', function() {
            expect(this.vm.orderable).toEqual(this.orderable);
        });

        it('should expose programs map', function() {
            expect(this.vm.programsMap).toEqual(this.programsMap);
        });
    });

    describe('goToOrderableList', function() {

        it('should call state go with correct params', function() {
            this.vm.goToOrderableList();

            expect(this.$state.go).toHaveBeenCalledWith('^.^', {}, {
                reload: true
            });
        });
    });
});