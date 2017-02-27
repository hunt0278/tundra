let gender = ""; //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;
let profiles = [];
let imgurl = "";
var savedProfileList = [];

//Function to get all the user profiles from the edumedia server using fetch
function getProfiles() {
    fetch(url)
        .then(function (response) {
            return response.json();
        console.log(response.json());
        })
        .then(function (data) {
            imgurl = decodeURIComponent(data.imgBaseURL);
            console.log("Image Url = " + imgurl);
            profiles = data.profiles;
            console.log("All Profiles" + profiles);
            showSingleProfile();

        })
        .catch(function (err) {
            console.log(err.message);
        });
}

getProfiles();


//The first screen which shows the user one by one depending on the swipe right and swipe left 
function showSingleProfile() {

    document.getElementById("single").className = "tab-item active";
    document.getElementById("list").className = "tab-item";

    var par = document.querySelector("#output");
    par.innerHTML = "";
// After user swipes profiles three times the profiles reload.
    if (profiles.length < 3) {

        getProfiles();
    } else {

        let person = profiles[0];
        let img = document.createElement("img");
        let p = document.createElement("p");

        p.id = "singleView";

        let name = "".concat(person.first, " ", person.last);
//        console.log("Name = " + name);
        let distance = "Distance: " + person.distance;
//        console.log("Distance = " distance);
        
        img.src = imgurl + person.avatar;
        p.appendChild(img);
        
        p.innerHTML += " " + name + "<br>" + distance + "<br>";
       console.log("DATA = " + name + distance); document.getElementById("output").appendChild(p);

        letSwipe();
    }
}



//If the user swipes right the profile goes to favourites, if the user swipes left the profile is deleted.
function showList() {

    document.getElementById("list").className = "tab-item active";
    document.getElementById("single").className = "tab-item";

    var par = document.querySelector("#output");
    par.innerHTML = "";

    var savedProfiles = JSON.parse(localStorage.getItem("hunt0278"));



        savedProfiles.forEach(function (person) {
            let img = document.createElement("img");
            let p = document.createElement("p");

            p.id = "listView";

            let name = "".concat(person.first, " ", person.last);
            img.src = imgurl + person.avatar;

            let trash = document.createElement("span");
            trash.className = "icon icon-trash";

            p.appendChild(trash);
            p.appendChild(img);

            p.innerHTML += " " + name;
            document.getElementById("output").appendChild(p);   

            p.addEventListener("click", function () {
                localStorage.setItem("hunt0278", JSON.stringify(savedProfiles));

                showList();
            });
        });
    
}

//This function is for swipe functionality which uses Zingtouch library and it swipes right and left depending on user interaction. 
function letSwipe() {

    var swipeArea = document.querySelector('#singleView');
    var activeRegion = ZingTouch.Region(swipeArea);

    activeRegion.bind(swipeArea, 'pan', function (e) {

        let angle = e.detail.data[0].directionFromOrigin;

        if (angle >= 315 && angle <= 360) {

            savedProfileList.push(profiles[0]);

            localStorage.setItem("hunt0278", JSON.stringify(savedProfileList));
                
            profiles.shift();

            var par = document.querySelector("#output");
            
            par.innerHTML = "<br><br><br><center>Profile Saved </center>";
            console.log("Swiped Right " + angle);
            setTimeout(function () {

                par.innerHTML = "";

                showSingleProfile();

            }, 470);
        } else if (angle >= 135 && angle <= 225) {

            profiles.shift();

            var par = document.querySelector("#output");

            par.innerHTML = "<br><br><br><center>Profile Deleted </center>";
            console.log("Swiped Left " + angle);
            setTimeout(function () {

                par.innerHTML = "";

                showSingleProfile();

            }, 470);
        }
    });
}


//Returns a list of elements within a document.
document.querySelector("#list").addEventListener('click', function (ev) {

    showList();
});


//Returns a single element within a document.
document.querySelector("#single").addEventListener('click', function (ev) {

    showSingleProfile();
});