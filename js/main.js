document.addEventListener('DOMContentLoaded', () => {
	// When the DOM has loaded.
	// Check if Its being displayed on mobile and disable mobile view
	if (window.mobilecheck()) {
		let disableMobile = document.querySelector('#disableMobile');
		disableMobile.style.display = 'flex';
	}

	// Load the student data from the server and populate the DOM with it
	let token = localStorage.getItem("healthTok");
	let loader = document.querySelector('#loaderBody');
	function fetchPings(nextUrl){
		/**
		* param {String} nextUrl - The next page dats to be accessed/loaded
		*/
		if(nextUrl){
			fetch(nextUrl, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			.then(res => res.json())
			.then(data => {
				// console.log("The loaded data is ", data);
				// Remove the loader
				loader.style.display = "none";
				let pingInfoSection = document.querySelector('#allPingDetails');
				if(data.success){
					// store the new url
					let newUrl = data.meta_data.links.next;
					localStorage.setItem('nextUrl', newUrl); 
					data.data.forEach(pingInfo => {
						// Extract the date data returned
						let dateTime = pingInfo.created_at;
						let {formattedDate, formattedTime} = formatDate(dateTime);
						pingInfoSection.innerHTML += `
							<div class="pingDetail" data-id=${pingInfo.student.id} data-time=${formattedTime}>
								<div class="col m3 l3 fullHeight center" id="pingDetailImageBody">
									<img src="${pingInfo.student.image}" alt="Pingers Image here">
									<!-- Has an active class when currently pinging and a passive one when not -->
									<img src="./images/active.png" alt="Active Pings Indicator" class="activePingIndicator passive">
								</div>
								<div class="col m9 l9 fullHeight">
									<div class="pingDetailTextBodyOne">
										<div class="fullHeight col m8 l8 pingDetailName">${pingInfo.student.first_name} ${pingInfo.student.last_name}</div>
										<div class="fullHeight col m4 l4 pingDetailTime">${formattedDate}</div>
									</div>
									<div class="pingDetailTextBodyTwo">
										${pingInfo.message}
									</div>
								</div>
							</div>
						`
					});
					displayCurrentPing();
					// Upload the first ping message as active
					if(nextUrl === "https://curefb.herokuapp.com/api/v1/healthcentre/ping"){
						let latestPingerName = document.querySelector("#latestPingerName");
						let latestPingerClinicNo = document.querySelector("#latestPingerClinicNo");
						let latestPingerTime = document.querySelector("#latestPingerTime");
						let latestPingMessage = document.querySelector("#latestPingMessage");

						let latestPingID = data.data[0].student.id;
						let message = data.data[0].message;
						console.log('The lates ping data is ', data.data[0].message);
						fetch(`https://curefb.herokuapp.com/api/v1/healthcentre/student/${latestPingID}`, {
							headers: {
								'Authorization': `Bearer ${token}`
							}
						})
						.then(res => res.json())
						.then(data => {
							console.log("The leatest pinger data is ", data);
							let payload = data.data;
							latestPingerName.textContent = `${payload.last_name} ${payload.first_name}`;
							latestPingerClinicNo.textContent = payload.clinic_number;
							latestPingerTime.textContent = `${formatDate(payload.updated_at).formattedTime}`;
							latestPingMessage.textContent = message;
						})
						.catch(err => {
							console.log(err);
						})
					}
				}
			})
			.catch(err => {
				// console.log("The err is ", err);
				loader.style.display = "none";
				let observer = document.querySelector('#observer');
				observer.textContent = "There are no more pings available...";
			})
		}
	}

	// Load in the data of students
	(function fetchFewStudents(){
		let someStudentsLoaderBody = document.querySelector('#someStudentsLoaderBody');
		fetch("https://curefb.herokuapp.com/api/v1/healthcentre/student?page_size=5", {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {
			let someStudentData = document.querySelector('#someStudentsData');
			if(data.success){
				let payload = data.data;
				// remove the loader 
				someStudentsLoaderBody.style.display = 'none';
				// console.log("payload=> ", payload);
				payload.forEach(student => {
					someStudentData.innerHTML += `
						<div class="displayFlex recentAddedBody">
							<div class="" id="recentlyAddedTableBody">
								<div class="col m5 l5 fullHeight displayFlexLeft">
									<img src="${student.image}" class="recentlyAddedUserImage">
									<span class="recentlyAddedUserName">${student.last_name} ${student.first_name}</span>
								</div>
								<div class="col m3 l3 fullHeight displayFlexLeft">${student.clinic_number}</div>
								<div class="col m3 l3 fullHeight displayFlexLeft">${student.mobile_number}</div>
								<div class="col m1 l1 fullHeight displayFlexLeft">Male</div>
							</div>
						</div>
					`;
				});
			}
		})
		.catch(err => {
			console.log("Could not fetch few students data => ", err);
		})
	})();
	// fetchFewStudents();




	// fetch the statistics of students

	(function fecthStats(){
		fetch("https://curefb.herokuapp.com/api/v1/healthcentre/statistics", {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {
			let payload = data.data;
			let pingsCount = document.querySelector("#pingsCount");
			let repliedPingsCount = document.querySelector("#repliedPingsCount");
			let videoCallsCount = document.querySelector("#videoCallsCount");
			let studentsCount = document.querySelector("#studentsCount");
			pingsCount.textContent = payload.pings;
			repliedPingsCount.textContent = payload.replied_pings;
			videoCallsCount.textContent = payload.video_calls;
			studentsCount.textContent = payload.students;
		})
		.catch(err => {
			console.log("Could not fetch statistics => ", err);
		});
	})();
	// fecthStats();




	let studentLoader = document.querySelector('#studentsLoaderBody');
	function fetchStudents(nextUrl){
		/**
		* param {String} nextUrl - The next page dats to be accessed/loaded
		*/
		if(nextUrl){
			fetch(nextUrl, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			.then(res => res.json())
			.then(data => {
				console.log("The loaded data isssssss soooo", data);
				// Remove the loader
				studentLoader.style.display = "none";
				if(data.success){
					let studentsSections = document.querySelector("#studentsSections");
					// store the new url
					let newUrl = data.meta_data.links.next;
					console.log("New URl is ", newUrl);
					localStorage.setItem('nextStudentUrl', newUrl);
					data.data.forEach(pingInfo => {
						// Populate the sudent section
						studentsSections.innerHTML += `
							<div class="studentSectionDiv" data-id="${pingInfo.id}">
								<div class="col m2 l2 fullHeight displayFlex">
									<img src="${pingInfo.image}" class="studentsSectionImages">
								</div>
								<div class="col m7 l7 fullHeight">
									<div class="halfHeight studentsSectionName">${pingInfo.last_name} ${pingInfo.first_name}</div>
									<div class="halfHeight studentsSectionNumber">${pingInfo.mobile_number}</div>
								</div>
								<div class="col m3 l3 fullHeight">
									<div class="halfHeight studentsSectionClinicNo">${pingInfo.clinic_number}</div>
									<div class="halfHeight studentsSectionLevel">200L</div>
								</div>
							</div>
						`
					});
				}
				// Listen to click events on all students body
				selectStudents();
			})
			.catch(err => {
				console.log("Could not fetch students data => ", err);
				studentLoader.style.display = "none";
				let observer = document.querySelector('#studentObserver');
				observer.textContent = "There are no more students available...";
			})
		}
	}

	fetchStudents("https://curefb.herokuapp.com/api/v1/healthcentre/student");
	observeElement('studentObserver', studentLoader, 'nextStudentUrl', fetchStudents);


	function selectStudents(){
		let studentDiv = document.querySelectorAll(".studentSectionDiv");
		studentDiv = Array.from(studentDiv);
		studentDiv.forEach(student => {
			student.addEventListener('click', () => {
				// Display the loader
				let historyLoaderBody = document.querySelector('#historyLoaderBody');
				historyLoaderBody.style.display = "block";
				let id = student.dataset.id; //The students ID
				// fetch the students data
				fetch(`https://curefb.herokuapp.com/api/v1/healthcentre/student/${id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				.then(res => res.json())
				.then(data => {
					if(data.success){
						data = data.data;
						console.log("The data is => ", data);
						let studentDetailsName = document.querySelector('#studentDetailsName');
						let studentDetailsClinicNo = document.querySelector('#studentDetailsClinicNo');
						// let studentDetailsLevel = document.querySelector('#studentDetailsLevel');
						let studentDetailsNumber = document.querySelector('#studentDetailsNumber');
						let studentDetailProfilePicture = document.querySelector('#studentDetailProfilePicture');
						studentDetailsName.textContent = `${data.last_name} ${data.first_name}`;
						studentDetailsClinicNo.textContent = data.clinic_number;
						// studentDetailsLevel.textContent = "level";
						studentDetailsNumber.textContent = data.mobile_number;
						studentDetailProfilePicture.src = data.image;
					}
				})
				.catch(err => {
					console.log("Can't fethc student data => ", err);
				});

				// Fetch the students history
				fetchPingHistory(id);
			})
		})
	}


	// Fetch the ping history of a student
	function fetchPingHistory(id){
		// Display the loader 
		let studentLoaderBody = document.querySelector('#studentLoaderBody');
		historyLoaderBody.style.display = "none";
		// fetch the students history
		fetch(`https://curefb.herokuapp.com/api/v1/healthcentre/ping?student=${id}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {
			if(data.success){
				let payload = data.data;
				let historyContainer = document.querySelector("#pingHistoryContainer");
				// Clear the previous student history
				historyContainer.innerHTML = "";
				if(payload.length == 0){
					historyContainer.innerHTML = "<div class='displayFlex'><h5>No ping has ever been made</h5></div>"
				}
				payload.forEach((history, index) => {
					let status = history.status === 'accepted' ? 'replied' : 'ignored';
					historyContainer.innerHTML += `
						<div class="" id="pingHistoryTableRows">
							<div class="col m1 l1 fullHeight displayFlex pingHistoryColumn">${index + 1}</div>
							<div class="col m4 l4 fullHeight displayFlex pingHistoryColumn message">${history.message.substr(0, 25)}...</div>
							<div class="pingHistoryFullMessage z-depth-2">
								<div class="pingHistoryFullMessageHeader">Ping Message</div>
								<div class="pingHistoryFullMessageText">
									${history.message}
								</div>
							</div>
							<div class="col m4 l4 historyDate fullHeight displayFlex pingHistoryColumn">September 30, 2019 7:16PM</div>
							<div class="col m3 l3 fullHeight displayFlex pingHistoryColumn">
								<div class="historyResponseStatus ${status} displayFlex">${status}</div>
							</div>
						</div>
					`
				});
				displayFullPingMessage();
			}
			console.log("Student History is => ", data);
		})
		.catch(err => {

		});
	}

	function displayFullPingMessage(){
	    // Display full ping messages once the ping message is clicked in the history page
	    let historyPingMessages = document.querySelectorAll('.pingHistoryColumn.message');
	    historyPingMessages = Array.from(historyPingMessages);

	    historyPingMessages.forEach(pingMessage => {
			let fullPingMessageContainer = pingMessage.nextElementSibling;
	    	// Display the ping message once it is hovered on
	    	pingMessage.addEventListener('mouseover', () => {
	    		// Display the full message
	    		fullPingMessageContainer.style.display = "block";
	    	});
	    	// Remove the ping message onco mouse moves out of it
	    	pingMessage.addEventListener('mouseout', () => {
	    		// Display the full message
	    		fullPingMessageContainer.style.display = "none";
	    	});
	    })
    }






	function observeElement(observe, loader, storageKey, callback){
		/**
		* @desc - Used to observe certain elments when they move into the page viewport 
		* @param {String} observe - ID of the Element to be observed
		* @param {String} loader - The ID of the loader to display when the element is in view
		* @param {storageKey} - The key for the localStorage Location of the next URL to be loaded
		* @param {Function} callback - function to be executed after observation is made
		*/
		let observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if(entry.intersectionRatio > 0){
					console.log("In view.................");
					loader.style.display = "flex";
					let nextUrl = localStorage.getItem(storageKey);
					if(nextUrl){
						callback(nextUrl);
					}
				}
			})
		});
		// Observe the Element which ID was specified
		observer.observe(document.querySelector(`#${observe}`));
	}
	observeElement('observer', loader, 'nextUrl', fetchPings);
	// Load the initial data
    fetchPings("https://"+"curefb.herokuapp.com/api/v1/healthcentre/ping");




    // All Page Actions such as button clicks are specified below
    let closeChatBtn = document.querySelector('#closeChat');
    let chatContainer = document.querySelector('#chatBodyContainer');
    closeChatBtn.addEventListener('click', () => {
	    chatContainer.style.display = "none";   	
    });

    // Display chat section
    let startChatBtn = document.querySelectorAll('.startChat');
    startChatBtn = Array.from(startChatBtn);
    startChatBtn.forEach(btn => {
	    btn.addEventListener('click', () => {
	    	chatContainer.style.display = "block";
	    	document.querySelector('#videoCallSection').style.display = 'none';
	    });
    })

    // Display the video call section
    let videoCallBtn = document.querySelector('#videoCallBtn');
    let chatVideoCallBtn = document.querySelector('#chatVideoCall');
    let videoCallSection = document.querySelector('#videoCallSection');
    let chatBodyContainer = document.querySelector('#chatBodyContainer');
    [videoCallBtn, chatVideoCallBtn].forEach(btn => {
	    btn.addEventListener('click', () => {
	    	videoCallSection.style.display = "block";
	    	chatBodyContainer.style.display = 'none';
	    });
    })

    // End the video call and close the video call display
    let videoCallEndBtn = document.querySelector('#videoCallEndBtn');
    videoCallEndBtn.addEventListener('click', () => {
    	videoCallSection.style.display = "none";
    });


    function displayCurrentPing(){
	    // Display the current ping Info when clicked 
	    let pingDetail= document.querySelectorAll('.pingDetail');
	    pingDetail = Array.from(pingDetail);
	    pingDetail.forEach(ping => {
	    	ping.addEventListener("click", () => {
	    		let id = ping.dataset.id;
	    		let time = ping.dataset.time;
	    		console.log("id is ", id);
	    		// fetch the students data
				fetch(`https://curefb.herokuapp.com/api/v1/healthcentre/student/${id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				.then(res => res.json())
				.then(data => {
					if(data.success){
						data = data.data;
						console.log("The data is => ", data);
						let latestPingerName = document.querySelector('#latestPingerName');
						let latestPingerClinicNo = document.querySelector('#latestPingerClinicNo');
						let latestPingerProfilePicture = document.querySelector('#latestPingImage');
						let latestPingerMessage = document.querySelector('#latestPingMessage');
						let latestPingerTime = document.querySelector('#latestPingerTime');
						latestPingerName.textContent = `${data.last_name} ${data.first_name}`;
						latestPingerClinicNo.textContent = data.clinic_number;
						latestPingerProfilePicture.src = data.image;
						latestPingerMessage.textContent = ping.querySelector('.pingDetailTextBodyTwo').textContent;
						latestPingerTime.textContent = time;
					}
				})
				.catch(err => {
					console.log("Can't fethc student data => ", err);
				});
	    	})
	    })
    }

});

window.mobilecheck = function() {

let check = false;
(function(a){
	if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	console.log("mobile? ", check);
	return check; 
}


function selectPings(){
	let sideMenuPing = document.querySelector('#sideMenuPing');
	let sideMenuStudent = document.querySelector('#sideMenuStudent');
	// Make the ping menu active
	sideMenuPing.classList.add('active');
	sideMenuStudent.classList.remove('active');
	// Change the icon to the default icon
	let src = sideMenuStudent.querySelector('img');
	let newSrc = src.src.split('/');
	let name = newSrc.pop();
	newSrc.push('user_grey.svg');
	newSrc = newSrc.join('/');
	src.src = newSrc; 
	// Make the student Icon inactive
	let pingSrc = sideMenuPing.querySelector('img').src.split('/');
	let pingName = pingSrc.pop();
	pingSrc.push('mail.svg');
	pingSrc = pingSrc.join('/');
	sideMenuPing.querySelector('img').src = pingSrc;
	// display the ping section and hide the student section
	let studentsSection = document.querySelector('#studentsSection');
	let pingsSection = document.querySelector('#pingsSection');
	pingsSection.style.display = "block";
	studentsSection.style.display = "none";
}

function selectStudent(){
	let sideMenuPing = document.querySelector('#sideMenuPing');
	let sideMenuStudent = document.querySelector('#sideMenuStudent');
	// Make the student menu active
	sideMenuPing.classList.remove('active');
	sideMenuStudent.classList.add('active');
	// Change the icon to the default icon
	let src = sideMenuStudent.querySelector('img');
	let newSrc = src.src.split('/');
	let name = newSrc.pop();
	newSrc.push('user.svg');
	newSrc = newSrc.join('/');
	src.src = newSrc;
	// Make the ping menu inactive
	let pingSrc = sideMenuPing.querySelector('img').src.split('/');
	let pingName = pingSrc.pop();
	pingSrc.push('mail_grey.svg');
	pingSrc = pingSrc.join('/');
	sideMenuPing.querySelector('img').src = pingSrc;
	// display the student section and hide the ping section
	let studentsSection = document.querySelector('#studentsSection');
	let pingsSection = document.querySelector('#pingsSection');
	pingsSection.style.display = "none";
	studentsSection.style.display = "block";
}