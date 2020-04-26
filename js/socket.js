document.addEventListener('DOMContentLoaded', () => {
	// Socket connection to latest ping
	let socket = new WebSocket("wss://curefb.herokuapp.com/ws/pings");
	socket.onmessage = function(event){
		// Display the reply buttons
		let pingReplyButtons = document.querySelector("#pingReplyButtons");
		pingReplyButtons.style.display = "flex";
		// Display the active ping section.
		let infoSectionLatestPingBody = document.querySelector('#infoSectionLatestPingBody');
		let data = event.data;
		data = JSON.parse(data);
		let id = data.text.id;
		localStorage.setItem('activePingID', id);
		console.log("The id is ", id);
		console.log(data);
		let pingsBody = document.querySelector("#allPingDetails");
		let newPing = `
			<div class="pingDetail" data-id="${data.text.id}">
				<div class="col m3 l3 fullHeight center" id="pingDetailImageBody">
					<img src="./images/profile1.jpg" alt="Pingers Image here">
					<img src="./images/active.png" alt="Active Pings Indicator" class="activePingIndicator active">
				</div>
				<div class="col m9 l9 fullHeight">
					<div class="pingDetailTextBodyOne">
						<div class="fullHeight col m8 l8 pingDetailName">Wendy Flores</div>
						<div class="fullHeight col m4 l4 pingDetailTime">${formatDate(data.text.created_at).formattedTime}</div>
					</div>
					<div class="pingDetailTextBodyTwo">
						${data.text.message.substr(0, 50)}...
					</div>
				</div>
			</div>
		`
		let frag = appendStringAsNodes(newPing)
		pingsBody.prepend(frag);
	}


	// Chat related functionalitied below
	let chatReplyText = document.querySelector("#chatReplyText");
	chatReplyText.addEventListener('keyup', (e) => {
		let message = chatReplyText.value
		if(e.keyCode === 13){
			// sendMessage(message)
			let chatBody = document.querySelector('#chatBody');
			chatBody.innerHTML += `
				<div class="sentMessage">
					<div class="sentMessageBody">
						${message}
					</div>
				</div>
			`
			document.querySelector('#chatBody').scrollTop += 500;
		}
	})
});

function appendStringAsNodes(html) {
    var frag = document.createDocumentFragment(),
        tmp = document.createElement('div'), child;
    tmp.innerHTML = html;
    // Append elements in a loop to a DocumentFragment, so that the browser does
    // not re-render the document for each node
    while (child = tmp.firstChild) {
        frag.appendChild(child);
    }
    // element.appendChild(frag); // Now, append all elements at once
    // frag = tmp = null;
    return frag;
}

async function pingRespoder(){
	let token = localStorage.getItem("healthTok");
	let id = localStorage.getItem('activePingID');
	let socket = await new WebSocket(`wss://curefb.herokuapp.com/ws/chat/${id}`);
	socket.onopen = function(event){
		console.log("Connected!! ", event);
		socket.send(JSON.stringify({'status': 'accepted'}));
	}
}

pingRespoder();


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
