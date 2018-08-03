var app = angular.module('plunker', ['vsGoogleAutocomplete']);

var MAP_CONTAINER_ID ='map';
var MAP_INIT_ZOOM = 10;
var apiKey = 'AIzaSyAQ7ehsb_54oCyFs7Fi8DJgAZyB-BWkV5o';

app.controller('MainCtrl', function($scope, $http, $timeout) {

  $scope.options = {
    types: ['(cities)'],
    componentRestrictions: { country: 'FR' }
  };

  $scope.address = {
    name: '',
    place: '',
    namenum: '',
    city: '',
    state: '',
    postCode: '',
    found: 'unknown',
    lkup: '',
    info: '',
    components: {
      placeId: '',
      streetNumber: '',
      street: '',
      city: '',
      state: '',
      countryCode: '',
      country: '',
      postCode: '',
      district: '',
      location: {
        lat: '',
        long: ''
      }
    }
  };


  $scope.validateAddress = function() {

  if ($scope.address.lkup == "none" || $scope.address.lkup == undefined || $scope.address.lkup.trim() == "") return;

  var api = 'https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.address.lkup +'&sensor=false&key='+apiKey;
  $http.get(api)
      .then(function(response) {
          let result = response.data;
          let addr = $scope.address;
          if (result.status == 'OK') {
            addr.found = "Address is Found";
            //fill model
            addr.components.location = result.results[0].geometry.location;
            addr.components.placeId = result.results[0].place_id;
            initMap(addr.components.location);
          }else
            $scope.address.found = "Address is not Found";
      });

    }

  $scope.resetForm = function() {
    document.getElementById("chkaddr").disabled = true;
    document.forms[0].reset();
    $scope.address.name = "";
    $scope.address.lkup = "none";
    $scope.address.components.placeId = "";
    $scope.address.found = "unknown";
    $scope.address.namenum="";
    $scope.address.city="";
    $scope.address.state="";
    $scope.address.postCode="";
    $scope.$apply();
  }

  $scope.buildAddress = function() {
        $scope.address.name = "";
        $scope.address.components.placeId = "";
        $scope.address.lkup = "none";

        let street =  $scope.address.namenum;
        let city  =  $scope.address.city;
        let state  =  $scope.address.state;
        let postcode  =  $scope.address.postCode;

        if ((street != undefined && street.trim() != "")
          && (city != undefined && city.trim() != "")
          && (state != undefined && state.trim() != "")
          && (postcode != undefined && postcode.trim() != "")
          ) {

          $scope.address.name = street + "," + city + "," + state + " " + postcode;
          $scope.address.lkup = $scope.address.name.replace(/\s+/g,"+");
          document.getElementById("chkaddr").disabled = false;
        }
    };


        $scope.initMap = function(target, coord, zoom){
        // The location of Uluru
        let loc = {lat: coord.lat, lng: coord.lng};
        // The map, centered at Uluru
        let map = new google.maps.Map(
            document.getElementById(target), {zoom: zoom, center: loc});
        // The marker, positioned at Uluru
        let marker = new google.maps.Marker({position: loc, map: map});
      }

    $scope.$watch("address.components.placeId", function (newValue, oldValue) {
        if (newValue == oldValue) return;
        let addr = $scope.address;
        if (addr.components.placeId != "") {
            addr.found = "Address is Found";
            //update the map
            $timeout(initMap(addr.components.location), 500);
        } else {
            addr.found = "unknown";;
        }
    });

});
