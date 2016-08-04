var BEALDER_API_ID = "";
var BEALDER_API_KEY = "";

var mAppInBackground = false;

var mNotificationId = 0;

var mRegionStateNames =
{
	'CLRegionStateInside': 'Enter',
	'CLRegionStateOutside': 'Exit'
};

var mRegions =
[
	{
		id: 'bealder',
		uuid: 'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
	}
];

var mRegionData =
{
	'bealder': 'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
};

function startMonitoringAndRanging()
{
	function onDidDetermineStateForRegion(result)
	{
	}

	function onDidRangeBeaconsInRegion(result)
	{

		var beacons = result.beacons;
	
		for (var i = 0; i < beacons.length; i++) {
			
			var uuid = beacons[i].uuid;
			var major = beacons[i].major;
			var minor = beacons[i].minor;
			var proximity = beacons[i].proximity;
			var uri = uuid + "/" + major + "/" + minor + "/" + "near";
			var url = "https://api.bealder.com/v2/app/beacon/" + uri;
							
			cordovaHTTP.setHeader("x-bealder-id", BEALDER_API_ID);
			cordovaHTTP.setHeader("x-bealder-key", BEALDER_API_KEY);
			cordovaHTTP.setHeader("x-bealder-udid", device.uuid);
			cordovaHTTP.setHeader("x-bealder-modele", device.manufacturer + " " + device.model);
			cordovaHTTP.setHeader("x-bealder-version", device.version);
			cordovaHTTP.setHeader("x-bealder-os", "cordova");
		
			cordovaHTTP.get(url, {}, {}, function(response) {
				
				console.log(response.status);
				response.data = JSON.parse(response.data);
				
				if (response.status === 200) {

					var content = response.data.content;
					var newurl = content.url;
					var title = content.title;
					var message = content.message;
				
					if (mAppInBackground) {
						cordova.plugins.notification.local.schedule({
							id: ++mNotificationId,
							title: title,
							text: message,
							data: { url: newurl}});
							
							cordova.plugins.notification.local.on("click", function (notification) {
								localStorage.setItem("offerurl", newurl);
								//window.location = "offer.html";
								cordova.InAppBrowser.open(newurl, '_blank', 'location=no');
								//mAppInBackground = true;
							});
					} else {
						localStorage.setItem("offerurl", newurl);
						//window.location = "offer.html";
						cordova.InAppBrowser.open(newurl, '_blank', 'location=no');
					//mAppInBackground = true;
					}
				}
				
			}, function(response) {
				//console.log(response.status);
				console.error(response.error);
			});
		}
	}

	function onError(errorMessage)
	{
		console.log('Monitoring beacons did fail: ' + errorMessage);
	}

	// Request permission from user to access location info.
	cordova.plugins.locationManager.requestAlwaysAuthorization();

	// Create delegate object that holds beacon callback functions.
	var delegate = new cordova.plugins.locationManager.Delegate();
	cordova.plugins.locationManager.setDelegate(delegate);

	// Set delegate functions.
	delegate.didDetermineStateForRegion = onDidDetermineStateForRegion;
	delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;

	// Start monitoring and ranging beacons.
	startMonitoringAndRangingRegions(mRegions, onError);
}

function startMonitoringAndRangingRegions(regions, errorCallback)
{
	// Start monitoring and ranging regions.
	for (var i in regions)
	{
		startMonitoringAndRangingRegion(regions[i], errorCallback);
	}
}

function startMonitoringAndRangingRegion(region, errorCallback)
{
	// Create a region object.
	var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
		region.id,
		region.uuid,
		region.major,
		region.minor);

	// Start ranging.
	cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
		.fail(errorCallback)
		.done();

	// Start monitoring.
	cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
		.fail(errorCallback)
		.done();
}

var bealderSDK = {

    run: function(api_id, api_key) {
		
		BEALDER_API_ID = api_id;
		BEALDER_API_KEY = api_key;
		
		cordovaHTTP.setHeader("x-bealder-id", BEALDER_API_ID);
		cordovaHTTP.setHeader("x-bealder-key", BEALDER_API_KEY);
		cordovaHTTP.setHeader("x-bealder-udid", device.uuid);
        cordovaHTTP.setHeader("x-bealder-modele", device.manufacturer + " " + device.model);
        cordovaHTTP.setHeader("x-bealder-version", device.version);
		cordovaHTTP.setHeader("x-bealder-os", "cordova");
		
		cordovaHTTP.get("https://api.bealder.com/v2/app/open", {}, {}, function(response) {
			console.log(response.status);
			//set beacon id avec ça
			startMonitoringAndRanging();

			var bc = response.data.beacons;
			try {
				response.data = JSON.parse(response.data);
			} catch(e) {
				console.error("JSON parsing error");
			}
			
		}, function(response) {
			console.error(response.error);
		});
	},
    setInBackground: function(inBackground) {// a appler à chaque fois dans pause/ resume
        mAppInBackground = inBackground;
    }
};

module.exports = bealderSDK;
