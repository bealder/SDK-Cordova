# Bealder SDk Cordova Installation

## Preparation

 * Get your **APP_ID** and **APP_KEY** from [app.bealder.com](https://app.bealder.com)

## Add the SDK

Put the sdk in the same folder as the project folder and then go in the project folder to type this :

 ```
 cordova plugin add ../SDK-Cordova
 ```
In the same folder, add the three following plugins : 

 ```
 cordova plugin add cordova-plugin-http
 cordova plugin add https://github.com/petermetz/cordova-plugin-ibeacon
 cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications
 ```

In your application you should have a onDeviceReady function, put this line inside :

 ```
 bealderSDK.run("API_ID", "API_KEY"); //don't forget to replace with yours
 ```

Where you define your onDeviceReady, two new events 

 ```
 document.addEventListener('pause', this.onAppToBackground, false);
 document.addEventListener('resume', this.onAppToForeground, false);
 ```
And :

 ```
 onAppToBackground: function() {
 	bealderSDK.setInBackground(true);
 }
	
 onAppToForeground: function() {
	bealderSDK.setInBackground(false);
 }
 ```

Here is an example of what it looks like in a code :

```
var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('pause', this.onAppToBackground, false);
		document.addEventListener('resume', this.onAppToForeground, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
				
		bealderSDK.run("moua7", "9de400d31369718b4e827054c1180c5b");
    },
	
	onAppToBackground: function() {
		bealderSDK.setInBackground(true);
	},
	
	onAppToForeground: function() {
		bealderSDK.setInBackground(false);
	},
	
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
```

Run your application !
