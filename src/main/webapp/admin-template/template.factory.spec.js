describe('templateFactory', function() {

    var rootScope, TemplateFactory, template, q, dependencyTestColumns;

    beforeEach(module('admin-template'));

    beforeEach(module(function($provide){
        var requisitionTemplateServiceSpy = jasmine.createSpyObj('requisitionTemplateService', [
                'get', 'getAll', 'search', 'save'
            ]),
            RequisitionColumnSpy =  jasmine.createSpyObj('RequisitionColumn', [
                'columnDependencies'
            ]);

        requisitionTemplateServiceSpy.get.andCallFake(function() {
            return q.when(template);
        });

        requisitionTemplateServiceSpy.getAll.andCallFake(function() {
            return q.when([template]);
        });

        requisitionTemplateServiceSpy.search.andCallFake(function(programId) {
            if(programId === template.programId) {
                return q.when(template);
            }
            return q.when(true);
        });

        requisitionTemplateServiceSpy.save.andCallFake(function(requisitionTemplate) {
            if(requisitionTemplate.id === template.id && requisitionTemplate.columnsMap.total.displayOrder === 3) {
                return q.when(requisitionTemplate);
            }
            return q.when(true);
        });

        $provide.factory('requisitionTemplateService', function(){
    		return requisitionTemplateServiceSpy;
    	});

        RequisitionColumnSpy.columnDependencies.andCallFake(function(column) {
            if(column.name === 'remarks') {
                return ['total'];
            } else if (column.name === 'totalCost') {
                return ['pricePerPack', 'packsToShip'];
            } else if (column.name === 'packsToShip') {
                return ['requestedQuantity', 'approvedQuantity'];
            } else if (column.name === 'pricePerPack') {
                return [];
            } else if (column.name === 'stockOnHand') {
                return ['beginningBalance', 'totalConsumedQuantity'];
            } else if (column.name === 'totalConsumedQuantity') {
                return ['beginningBalance', 'stockOnHand'];
            }
            return null;
        });

        $provide.factory('RequisitionColumn', function(){
    		return RequisitionColumnSpy;
    	});
    }));

    beforeEach(inject(function($httpBackend, $rootScope, templateFactory, openlmisUrlFactory, $q) {
        rootScope = $rootScope;
        TemplateFactory = templateFactory;
        openlmisURL = openlmisUrlFactory;
        q = $q;

        template = {
            id: '1',
            programId: '2',
            numberOfPeriodsToAverage: 2,
            columnsMap : {
                total: {
                    isDisplayed: true,
                    displayOrder: 1,
                    name: 'total',
                    label: 'Total',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['USER_INPUT'],
                        isDisplayRequired: false,
                        options: [
                            {
                                id: '1',
                                optionLabel: 'option1'
                            },
                            {
                                id: '2',
                                optionLabel: 'option2'
                            },
                        ]
                    },
                    source: 'USER_INPUT',
                    option: {
                        'id': '1',
                        'optionLabel': 'option1'
                    }
                },
                remarks: {
                    isDisplayed: true,
                    displayOrder: 2,
                    name: 'remarks',
                    label: 'Remarks',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['USER_INPUT', 'CALCULATED'],
                        isDisplayRequired: false,
                        options: []
                    },
                    source: 'USER_INPUT'
                },
                averageConsumption: {
                    isDisplayed: true,
                    displayOrder: 3,
                    name: 'averageConsumption',
                    source: 'CALCULATED',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['CALCULATED'],
                        isDisplayRequired: false,
                        options: [ ]
                    }
                },
                requestedQuantity: {
                    name: 'requestedQuantity',
                    displayOrder: 4,
                    isDisplayed: true,
                    label: "Requested Quantity",
                    source: 'USER_INPUT',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['USER_INPUT'],
                        isDisplayRequired: false,
                        options: [ ]
                    }
                },
                requestedQuantityExplanation: {
                    name: 'requestedQuantityExplanation',
                    displayOrder: 5,
                    isDisplayed: true,
                    label: "Requested Quantity Explanation",
                    source: 'USER_INPUT',
                    columnDefinition: {
                        canChangeOrder: true,
                        sources: ['USER_INPUT'],
                        isDisplayRequired: false,
                        options: [ ]
                    }
                }
            }
        };

        dependencyTestColumns = {
            pricePerPack: {
                isDisplayed: true,
                displayOrder: 1,
                name: 'pricePerPack',
                label: 'Price per Pack',
                columnDefinition: {
                    canChangeOrder: true,
                    sources: ['REFERENCE_DATA'],
                    isDisplayRequired: false,
                    options: []
                },
                source: 'REFERENCE_DATA'
            },
            totalCost: {
                isDisplayed: true,
                displayOrder: 2,
                name: 'totalCost',
                label: 'Total Cost',
                columnDefinition: {
                    canChangeOrder: true,
                    sources: ['CALCULATED'],
                    isDisplayRequired: false,
                    options: []
                },
                source: 'CALCULATED'
            },
            packsToShip: {
               isDisplayed: true,
               displayOrder: 3,
               name: 'packsToShip',
               label: 'Packs to Ship',
               columnDefinition: {
                   canChangeOrder: true,
                   sources: ['CALCULATED'],
                   isDisplayRequired: false,
                   options: []
               },
               source: 'CALCULATED'
           },
           requestedQuantity: {
              isDisplayed: true,
              displayOrder: 4,
              name: 'requestedQuantity',
              label: 'Requested Quantity',
              columnDefinition: {
                  canChangeOrder: true,
                  sources: ['USER_INPUT'],
                  isDisplayRequired: false,
                  options: []
              },
              source: 'USER_INPUT'
          },
          approvedQuantity: {
              isDisplayed: true,
              displayOrder: 5,
              name: 'approvedQuantity',
              label: 'Approved Quantity',
              columnDefinition: {
                  canChangeOrder: true,
                  sources: ['USER_INPUT'],
                  isDisplayRequired: false,
                  options: []
              },
              source: 'USER_INPUT'
          },
          stockOnHand: {
              isDisplayed: true,
              displayOrder: 6,
              name: 'stockOnHand',
              label: 'Stock On Hand',
              columnDefinition: {
                 canChangeOrder: true,
                 sources: ['USER_INPUT', 'CALCULATED'],
                 isDisplayRequired: false,
                 options: []
              },
              source: 'CALCULATED'
           },
          totalConsumedQuantity: {
              isDisplayed: true,
              displayOrder: 6,
              name: 'totalConsumedQuantity',
              label: 'Total Consumed Quantity',
              columnDefinition: {
                 canChangeOrder: true,
                 sources: ['USER_INPUT', 'CALCULATED'],
                 isDisplayRequired: false,
                 options: []
              },
              source: 'USER_INPUT'
           },
           beginningBalance: {
              isDisplayed: true,
              displayOrder: 7,
              name: 'beginningBalance',
              label: 'Beginning Balance',
              columnDefinition: {
                 canChangeOrder: true,
                 sources: ['USER_INPUT'],
                 isDisplayRequired: false,
                 options: []
              },
              source: 'USER_INPUT'
           }
        };
    }));

    it('should get template by id and add required methods', function() {
        var data;

        TemplateFactory.get(template.id).then(function(response) {
            data = response;
        });

        rootScope.$apply();

        expect(data.id).toEqual(template.id);
        expect(angular.isFunction(data.$isValid)).toBe(true);
        expect(angular.isFunction(data.$save)).toBe(true);
        expect(angular.isFunction(data.$moveColumn)).toBe(true);
        expect(angular.isFunction(data.$findCircularCalculatedDependencies)).toBe(true);
        angular.forEach(data.columnsMap, function(column) {
            expect(angular.isFunction(data.$isValid)).toBe(true);
        });
    });

    it('should get all templates', function() {
        var data;

        TemplateFactory.getAll().then(function(response) {
            data = response;
        });

        rootScope.$apply();

        expect(data[0].id).toEqual(template.id);
    });

    it('should get template by program id', function() {
        var data;

        TemplateFactory.getByProgram(template.programId).then(function(response) {
            data = response;
        });

        rootScope.$apply();

        expect(data.id).toEqual(template.id);
    });

    it('should save template', function() {
        var data, requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.displayOrder = 3;

        requisitionTemplate.$save().then(function(response) {
            data = response;
        });
        rootScope.$apply();

        expect(data.id).toEqual(template.id);
        expect(data.columnsMap.total.displayOrder).toEqual(3);
    });

    it('should check if template is valid and return true', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.$isValid()).toBe(true);
    });

    it('should check if template is valid when column is not displayed and column source is set to user input and there is more than one source to choose', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.remarks.isDisplayed = false;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when column has empty source', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.source = null;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when column has empty option and columnDefinition.options are not empty', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.columnsMap.total.option = null;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when number of periods to average is not greater than or equal to 2', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.numberOfPeriodsToAverage = 0;

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should check if template is valid when number of periods to average is empty', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        requisitionTemplate.numberOfPeriodsToAverage = '';

        expect(requisitionTemplate.$isValid()).toBe(false);
    });

    it('should move total column below remarks column', function() {
        var requisitionTemplate, columnCopy;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        columnCopy = angular.copy(requisitionTemplate.columnsMap.total);
        expect(requisitionTemplate.$moveColumn(columnCopy, 2)).toBe(true);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(1);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(2);
    });

    it('should move remarks column above total column', function() {
        var requisitionTemplate, columnCopy;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks);
        expect(requisitionTemplate.$moveColumn(columnCopy, 0)).toBe(true);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(1);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(2);
    });

    it('should not move column if canChangeOrder is set to false', function() {
        var requisitionTemplate, columnCopy;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        requisitionTemplate.columnsMap.remarks.columnDefinition.canChangeOrder = false;

        columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks);
        expect(requisitionTemplate.$moveColumn(columnCopy, 0)).toBe(false);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);
    });

    it('should not move column if it is not between the same pinned columns', function() {
        var requisitionTemplate, columnCopy;

        template.columnsMap.beginningBalance = {
            isDisplayed: true,
            displayOrder: 2,
            name: 'beginningBalance',
            label: 'Beginning Balance',
            columnDefinition: {
                canChangeOrder: false,
                sources: ['USER_INPUT', 'CALCULATED'],
                isDisplayRequired: false
            },
            source: 'USER_INPUT'
        };
        template.columnsMap.remarks.displayOrder = 3;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(3);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);

        columnCopy = angular.copy(requisitionTemplate.columnsMap.remarks);
        expect(requisitionTemplate.$moveColumn(columnCopy, 0)).toBe(false);

        expect(requisitionTemplate.columnsMap.remarks.displayOrder).toBe(3);
        expect(requisitionTemplate.columnsMap.beginningBalance.displayOrder).toBe(2);
        expect(requisitionTemplate.columnsMap.total.displayOrder).toBe(1);
    });

    it('should allow calculated column to depend on a different calculated column', function() {
        var requisitionTemplate;

        template.columnsMap = dependencyTestColumns;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.$findCircularCalculatedDependencies('totalCost')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('pricePerPack')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('packsToShip')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('requestedQuantity')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('approvedQuantity')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('stockOnHand')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('beginningBalance')).toEqual([]);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('totalConsumedQuantity')).toEqual([]);
    });

    it('should find circular calculated dependencies', function() {
        var requisitionTemplate;

        template.columnsMap = dependencyTestColumns;
        template.columnsMap.totalConsumedQuantity.source = 'CALCULATED';

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.$findCircularCalculatedDependencies('stockOnHand'))
            .toEqual(['totalConsumedQuantity']);
        expect(requisitionTemplate.$findCircularCalculatedDependencies('totalConsumedQuantity'))
            .toEqual(['stockOnHand']);
        // check this just in case
        expect(requisitionTemplate.$findCircularCalculatedDependencies('totalCost')).toEqual([]);
    });

    it('should check if requestedQuantity and requestedQuantityExplanation have the same display', function() {
        var requisitionTemplate;

        TemplateFactory.get(template.id).then(function(response) {
            requisitionTemplate = response;
        });
        rootScope.$apply();

        expect(requisitionTemplate.$isValid()).toBe(true);

        requisitionTemplate.columnsMap.requestedQuantity.isDisplayed = false;
        expect(requisitionTemplate.$isValid()).toBe(false);

        requisitionTemplate.columnsMap.requestedQuantityExplanation.isDisplayed = false;
        requisitionTemplate.columnsMap.requestedQuantity.isDisplayed = true;
        expect(requisitionTemplate.$isValid()).toBe(false);

        requisitionTemplate.columnsMap.requestedQuantity.isDisplayed = false;
        expect(requisitionTemplate.$isValid()).toBe(true);
    });
});
