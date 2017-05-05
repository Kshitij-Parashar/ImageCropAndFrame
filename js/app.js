var getMeAShop = angular.module('getMeAShop', ['ui.router','ngImgCrop']);

getMeAShop.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/cropper');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('cropper', {
            url: '/cropper',
            templateUrl: 'html/cropper.html'
        })

});

