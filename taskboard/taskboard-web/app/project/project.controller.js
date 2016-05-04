(function() {
  'use strict'
  angular.module( 'taskBoardApp.controllers')
    .controller("ProjectController", ProjectController);

  function ProjectController( API , $routeParams , $location , $timeout , $uibModal , Security ) {

    let vm = this;

    ///////////////////

    vm.id;
    vm.title;
    vm.lanes;

    ///////////////////

    vm.goBack       = goBack;
    vm.openNewLane  = openNewLane;
    vm.openSettings = openSettings;
    vm.onLaneRemove = onLaneRemove;

    activate();

    ///////////////////

    function activate () {
      API.getProject($routeParams.id).then((project) => {
          vm.id = project.id;
          vm.title = project.title;
          vm.lanes = project.lanes;
          vm.lanes.forEach(loadTasks);
      });
    }

    function loadTasks ( lane ) {
      let index = vm.lanes.indexOf(lane);
      API.getLane(lane.id).then((updated) => vm.lanes[ index ].tasks = updated.tasks);
    }

    function goBack () {
      $location.path("/projects");
    }

    function openNewLane () {
      let newLaneModal = $uibModal.open({
        templateUrl : 'app/lane/new-lane.html',
        controller  : 'NewLaneController',
        controllerAs: 'lane'
      });
      newLaneModal.result.then(activate);
    }

    function openSettings () {
      let settingsModal = $uibModal.open({
        templateUrl  : 'app/project/settings.html',
        controller   : 'SettingsController',
        controllerAs : 'settings'
      });
      settingsModal.result.then(activate);
    }

    function onLaneRemove () {
      // TODO maybe remove from lanes and don't refresh them all?
      activate();
    }

  }
})();
