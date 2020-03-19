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
	// Make the student Icon inactive
	let pingSrc = sideMenuPing.querySelector('img').src.split('/');
	let pingName = pingSrc.pop();
	pingSrc.push('mail.svg');
	pingSrc = pingSrc.join('/');
	sideMenuPing.querySelector('img').src = pingSrc;
	// display the ping section and hide the student section
	let studentsSection = document.querySelector('#studentsSection');
	let pingsSection = document.querySelector('#pingsSection');
	pingsSection.style.display = "flex";
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
	studentsSection.style.display = "flex";
}