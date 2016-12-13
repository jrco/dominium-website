'use strict';

// Register `gameList` component, along with its associated controller and template
angular.
  module('gameList').
  component('gameList', {
    templateUrl: 'game-list/game-list.template.html',
    controller: ['$http',function gameListController($http) {
      var self = this;
      //self.orderProp = 'age';

      $http.get('/games').then(function(response) {
        self.games = response.data;
      });
    }]
      /*this.games = [
        {
          name: 'Nexus S',
          snippet: 'Fast just got faster with Nexus S.'
        }, {
          name: 'Motorola XOOM™ with Wi-Fi',
          snippet: 'The Next, Next Generation tablet.'
        }, {
          name: 'MOTOROLA XOOM™',
          snippet: 'The Next, Next Generation tablet.'
        }
      ];

      this.orderProp = 'age';
      */
    
  });
