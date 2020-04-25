document.addEventListener('DOMContentLoaded', () => {
	// Socket connection to latest ping
	let socket = new WebSocket("wss://curefb.herokuapp.com/ws/pings");
	socket.onmessage = function(event){
		console.log(event)
		let pingsBody = document.querySelector("#allPingDetails");
		let newPing = `
			<div class="pingDetail">
				<div class="col m3 l3 fullHeight center" id="pingDetailImageBody">
					<img src="./images/profile1.jpg" alt="Pingers Image here">
					<img src="./images/active.png" alt="Active Pings Indicator" class="activePingIndicator active">
				</div>
				<div class="col m9 l9 fullHeight">
					<div class="pingDetailTextBodyOne">
						<div class="fullHeight col m8 l8 pingDetailName">Wendy Flores</div>
						<div class="fullHeight col m4 l4 pingDetailTime">10:52AM</div>
					</div>
					<div class="pingDetailTextBodyTwo">
						Hello There, I'm currently at the school ......... ...
					</div>
				</div>
			</div>
		`
		pingsBody.prepend(newPing);
	}
});


function formatDate(dateTime){
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
	formattedDate[1] = formattedDate[1] + ',';
	formattedDate.push(formattedDateYear);
	formattedDate = formattedDate.join(' ');
	// format time
	formattedTime = formattedTime.split(':');
	let formattedTimeM = formattedTime.pop().split(' ').pop();
	formattedTime = formattedTime.join(':') + ` ${formattedTimeM}`;
	// let moment = moment("20120620", "YYYYMMDD").fromNow();
	// console.log("moment is ", moment);
	return {formattedDate, formattedTime};
}
