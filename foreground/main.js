// This example shows how to request a device from an user.

let wappsto = new Wappsto();

// Require Devices that matches "Current Weather" name. second argument provides a message that explains the need of this request
wappsto.get(
  "device",
  {
    name: "Sosche HD Air Ferrule"
  },
  {
    expand: 3,
    quantity: 1,
    subscribe: true,
    message: "The application requires that the speciel network is running.",
    success: deviceCollection => {
      // When the request is successful, it means you already have the device.
      let device = deviceCollection.first();

      if (device) {
        // log device in the browser console
        console.log("Here is '" + device.get("name") + "' device!");
        console.log(device);

        // Gets value from the device that matches requirements
        var value = device.get("value").findWhere({
          name: "Amor Supremo"
        });

        if (value) {
          // get temperature Report state
          var reportState = value.get("state").findWhere({ type: "Report" });
          // get data
          var data = reportState.get("data");
          // log value in the browser console
          console.log("Here is '" + device.get("name") + "' Amor Supremo value data: '" + data + "'!");
          console.log(value);
        }
      }
    },
    error: (deviceCollection, response) => {
      // you receive an error when you don't have any devices. That is why we have to subscribe to stream
      if (response.status === 503) {
        alert("Service unavailable");
      }
    },
    onStatusChange: status => {
      // if you want to track it to show something to the user
      if (status) {
        console.log("Status: " + status);
      }
    }
  }
);

function populateList(list) {
    list.append(document.createElement("LI"))
    
};
