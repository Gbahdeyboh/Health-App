document.addEventListener('DOMContentLoaded', () => {
	// When the DOM has loaded.
	// Highligh the selected side menu option 

	let sideMenuText = document.querySelectorAll('.sideMenuOptions');
	sideMenuText = Array.from(sideMenuText);

	sideMenuText.forEach(menu => {
		menu.addEventListener('click', () => {
			// Make all menus inactive initially
			sideMenuText.forEach(innerMenu => {
				innerMenu.classList.remove('active');
				// Change the icon to the default icon
				let src = innerMenu.querySelector('img');
				let newSrc = src.src.split('/');
				newSrc.pop();
				newSrc.push('mail_grey.svg');
				newSrc = newSrc.join('/');
				src.src = newSrc;
			})
			// Make the selected menu Active
			menu.classList.add('active');
			// Change the icon to the default icon
			let src = menu.querySelector('img');
			let newSrc = src.src.split('/');
			newSrc.pop();
			newSrc.push('mail.svg');
			newSrc = newSrc.join('/');
			src.src = newSrc;
		});
	})
})