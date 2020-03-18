document.addEventListener('DOMContentLoaded', () => {
	// When the DOM has loaded.
	// Highligh the selected side menu option 

})
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

	let pingSrc = sideMenuPing.querySelector('img').src.split('/');
	let pingName = pingSrc.pop();
	pingSrc.push('mail.svg');
	pingSrc = pingSrc.join('/');
	sideMenuPing.querySelector('img').src = pingSrc;
}

function selectStudent(){
	let sideMenuPing = document.querySelector('#sideMenuPing');
	let sideMenuStudent = document.querySelector('#sideMenuStudent');
	// Make the ping menu active
	sideMenuPing.classList.remove('active');
	sideMenuStudent.classList.add('active');
	// Change the icon to the default icon
	let src = sideMenuStudent.querySelector('img');
	let newSrc = src.src.split('/');
	let name = newSrc.pop();
	newSrc.push('user.svg');
	newSrc = newSrc.join('/');
	src.src = newSrc;
	let pingSrc = sideMenuPing.querySelector('img').src.split('/');
	let pingName = pingSrc.pop();
	pingSrc.push('mail_grey.svg');
	pingSrc = pingSrc.join('/');
	sideMenuPing.querySelector('img').src = pingSrc;
}