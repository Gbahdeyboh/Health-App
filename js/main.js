document.addEventListener('DOMContentLoaded', () => {
	// When the DOM has loaded.
	// Check if Its being displayed on mobile and disable mobile view
	if (window.mobilecheck()) {
		let disableMobile = document.querySelector('#disableMobile');
		disableMobile.style.display = 'flex';
	}

	// Load the student data from the server and populate the DOM with it
	let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJoZGljNzMwMmljbXMiLCJpYXQiOjE1ODczMDQ3NjQsImV4cCI6MTU4NzQ3NzU2NH0.Vp7q74unDdY5LBOw2Vr550YoTNmKmUSIkEdhUPvRRtY";
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
				console.log("The loaded data is ", data);
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
						dateTime = dateTime.split('.');
						dateTime.pop();
						dateTime = dateTime[0].split('T');
						// date
						let date = dateTime[0];
						date = date.split('-');
						let year = date[0];
						let month = date[1];
						let day = date[2];
						// time
						let time = dateTime[1];
						time = time.split(':');
						let hour = time[0];
						let minutes = time[1];
						let seconds = time[2];
						// format date and time to required format
						let formattedDate = new Date(year, month, day, hour, minutes, seconds);
						let formattedTime = formattedDate.toLocaleTimeString();
						// format date
						formattedDate = formattedDate.toDateString();
						formattedDate = formattedDate.split(' ');
						formattedDate.shift();
						let formattedDateYear = formattedDate.pop();
						formattedDate.push(',' + formattedDateYear);
						formattedDate = formattedDate.join(' ');
						// format time
						formattedTime = formattedTime.split(':');
						let formattedTimeM = formattedTime.pop().split(' ').pop();
						formattedTime = formattedTime.join(':') + ` ${formattedTimeM}`;
						// console.log("The formatted zzZ")
						pingInfoSection.innerHTML += `
							<div class="" id="pingDetail" data-is=${pingInfo.id}>
								<div class="col m3 l3 fullHeight center" id="pingDetailImageBody">
									<img src="${pingInfo.student.image}">
								</div>
								<div class="col m9 l9 fullHeight">
									<div class="" id="pingDetailTextBodyOne">
										<div class="fullHeight col m8 l8 pingDetailName">${pingInfo.student.first_name} ${pingInfo.student.last_name}</div>
										<div class="fullHeight col m4 l4 pingDetailTime">${formattedDate} ${formattedTime}</div>
									</div>
									<div class="pingDetailTextBodyTwo">
										${pingInfo.message}
									</div>
								</div>
							</div>
						`
					});
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
	function fetchFewStudents(){
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
				console.log("payload=> ", payload);
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
	}
	fetchFewStudents();




	// fetch the statistics of students

	function fecthStats(){
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
	}
	fecthStats();
	
















	function observeElement(observe, callback){
		/**
		* @param {String} observe - Element to observe
		* @param {Function} callback - function to be executed after observation is made
		*/
		let observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if(entry.intersectionRatio > 0){
					console.log("In view.................");
					loader.style.display = "flex";
					let nextUrl =localStorage.getItem('nextUrl');
					if(nextUrl){
						callback(nextUrl);
					}
				}
			})
		});

		observer.observe(document.querySelector(`#${observe}`));
	}
	observeElement('observer', fetchPings);
	// Load the initial data
    fetchPings("https://"+"curefb.herokuapp.com/api/v1/healthcentre/ping");
    // Socket connection to latest ping
    let socket = new WebSocket("wss://healfb.herokuapp.com/ws/pings");
    socket.onmessage = function(event){
    	alert("Pinginggg.....", event.data);
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