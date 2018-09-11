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

describe('ProductListController', function() {

    var $state, $controller,
        vm, products, programs, stateParams;

    beforeEach(function() {
        module('admin-product-list');

        inject(function($injector) {
            $controller = $injector.get('$controller');
            $state = $injector.get('$state');
        });

        programs = [
            {
                id: 'program-id-1',
                name: 'program-1'
            },
            {
                id: 'program-id-2',
                name: 'program-2'
            }
        ];
        products = [
            {
                id: 'product-id-1',
                name: 'product-1',
                code: 'code-1',
                programs: [
                    {
                        id: programs[0].id
                    },
                    {
                        id: programs[1].id
                    }
                ]
            },
            {
                id: 'product-id-2',
                name: 'product-2',
                code: 'code-2',
                programs: [
                    {
                        id: programs[0].id
                    }
                ]
            }
        ];
        stateParams = {
            page: 0,
            size: 10,
            code: 'code',
            name: 'product',
            program: programs[0].id
        };

        vm = $controller('ProductListController', {
            products: products,
            programs: programs,
            $stateParams: stateParams
        });
        vm.$onInit();

        spyOn($state, 'go').andReturn();
    });

    describe('onInit', function() {

        it('should expose search method', function() {
            expect(angular.isFunction(vm.search)).toBe(true);
        });

        it('should expose products array', function() {
            expect(vm.products).toEqual(products);
        });

        it('should expose programs array', function() {
            expect(vm.programs).toEqual(programs);
        });

        it('should expose code', function() {
            expect(vm.code).toEqual(stateParams.code);
        });

        it('should expose name', function() {
            expect(vm.name).toEqual(stateParams.name);
        });

        it('should expose program', function() {
            expect(vm.program).toEqual(stateParams.program);
        });
    });

    describe('search', function() {

        it('should set code param', function() {
            vm.code = 'some-code';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.products', {
                page: stateParams.page,
                size: stateParams.size,
                code: 'some-code',
                name: stateParams.name,
                program: stateParams.program
            }, {
                reload: true
            });
        });

        it('should set name param', function() {
            vm.name = 'some-name';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.products', {
                page: stateParams.page,
                size: stateParams.size,
                code: stateParams.code,
                name: 'some-name',
                program: stateParams.program
            }, {
                reload: true
            });
        });

        it('should set name description', function() {
            vm.program = 'some-program';

            vm.search();

            expect($state.go).toHaveBeenCalledWith('openlmis.administration.products', {
                page: stateParams.page,
                size: stateParams.size,
                code: stateParams.code,
                name: stateParams.name,
                program: 'some-program'
            }, {
                reload: true
            });
        });

        it('should call state go method', function() {
            vm.search();
            expect($state.go).toHaveBeenCalled();
        });
    });
});
