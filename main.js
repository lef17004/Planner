//make sure fireBaseConfig is in another file called config.js
firebase.initializeApp(firebaseConfig);

var idCount = firebase.firestore().collection("id")
idCount.onSnapshot(function(snapshot) {
  snapshot.docChanges().forEach(function(change) {
    if (change.type === 'removed') {
      alert("Failed to get ids")
    } else {
      //var event = change.doc.data();
      var id = change.doc.data();

      idCount = id.nextId
    }
  });
});


var newDate = new Date()
document.querySelector("#date2").value = (newDate.getMonth() + 1) + "/" + (newDate.getDate()) + "/" + newDate.getFullYear()

function saveEvent(name, notes = "", startTime, endTime, category = 0, confirmed = true, reminder = false) {
  // Add a new message entry to the database.
  return firebase.firestore().collection('events').doc(idCount.toString()).set({
    name: name,
    id: idCount,
    notes: notes,
    startTime: startTime,
    startTime: firebase.firestore.Timestamp.fromDate(startTime),
    endTime: firebase.firestore.Timestamp.fromDate(endTime),
    date: (startTime.getMonth() + 1) + "/" + (startTime.getDate()) + "/" + startTime.getFullYear(),
    category: category,
    confirmed: confirmed,
    reminder: reminder
  }).catch(function(error) {
    console.error('Error writing new message to database', error);
  });
}

function saveId(newId) {
  firebase.firestore().collection("id").doc("eventIds").update({
    "nextId": newId
  })
}


function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}












function save() {
  var name = document.querySelector("#nameBox").value
  var notes = document.querySelector("#eventNotes").value



  var year = document.querySelector("#date").value
  var startDate = new Date(year)

  const startHour = document.querySelector("#startTimeHour").value
  const startMinute = document.querySelector("#startTimeMin").value
  startDate.setHours(parseInt(startHour))
  startDate.setMinutes(parseInt(startMinute))

  var endDate = new Date(year)
  const endHour = document.querySelector("#endTimeHour").value
  const endMinute = document.querySelector("#endTimeMin").value
  endDate.setHours(parseInt(endHour))
  endDate.setMinutes(parseInt(endMinute))

 

  saveEvent(name, notes, startDate, endDate)
  idCount++
  saveId(idCount)
}




function display() {

  const date = document.querySelector("#date2").value


  var query = firebase.firestore()
                  .collection('events')
                  .where("date", "==", date)


  // Start listening to the query.
  query.onSnapshot(function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        alert("Fail")
      } else {
        var event = change.doc.data();
        var display = document.querySelector("#eventsDisplay")

        var listing = document.createElement("DIV")
        var name = document.createElement("H3")
        var notes = document.createElement("P")
        var date = document.createElement("P")
        var startTime = document.createElement("P")
        var endTime = document.createElement("P")

        const startHour = event.startTime.toDate().getHours() + 1
        const startMinute = event.startTime.toDate().getMinutes()
        const endHour = event.endTime.toDate().getHours() + 1
        const endMinute = event.endTime.toDate().getMinutes()


        var stamp1 = "AM"
        var stamp2 = "AM"

        if (startHour > 12) {
          startHour -= 12
          stamp1 = "PM"
        }

        if (endHour > 12) {
          endHour -= 12
          stamp2 = "PM"
        }

        name.innerHTML = "Name: " + event.name
        notes.innerHTML = "Notes: " + event.notes
        date.innerHTML = "Date: " + event.date
        startTime.innerHTML = "Start: " + startHour + ":" + startMinute + " " + stamp1
        endTime.innerHTML = "End: " + endHour + ":" + endMinute + " " + stamp1


        listing.appendChild(name)
        listing.appendChild(notes)
        listing.appendChild(date)
        listing.appendChild(startTime)
        listing.appendChild(endTime)


        display.appendChild(listing)
      }
    });
  });
}
