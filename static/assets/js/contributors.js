const types = window.contributorTypes

const joinAnd = ((data, separator = "and") => {
	// Based on https://github.com/rasshofer/and/blob/master/and.js
	const input = [...data], items = input.length, lastItem = input.pop();
	if (input.length) return `${input.join(', ')}${items > 2 ? ',': ''} ${separator} ${lastItem}`.trim()
	else return lastItem
})


const run = async () => {
	
	let contributors = await (await fetch("https://raw.githubusercontent.com/ScratchAddons/contributors/with-commits/contributors.json")).json()

	document.querySelector(".lds-ellipsis").hidden = true

	document.querySelector('#contributors-count').textContent = window.i18nStrings.nContributors.replace('-1', contributors.length)

	// Create elements based on the object
	contributors.forEach(contributor => {
		
		// Contributor name text (top part)
		let nameEl = document.createElement("p")
		nameEl.className = "contributor-name"
		nameEl.textContent = contributor.login

		// Contributor details (bottom part)
		let detailsEl = document.createElement("p")
		detailsEl.className = "contribution-details"
		if (contributor.contributions) contributor.contributions.forEach(i => {
			let contributionEl = document.createElement("span")
			contributionEl.title = types[i].description
			contributionEl.dataset.toggle = "tooltip"
			contributionEl.dataset.placement = "bottom"
			contributionEl.innerHTML = types[i].symbol
			detailsEl.appendChild(contributionEl)
		})
		if (contributor.commits) {
			let contributionEl = document.createElement("span")
			contributionEl.classList.add("contribution-commits")
			contributionEl.insertAdjacentHTML("beforeend", `<span class="iconify" data-icon="octicon:git-commit-16"></span> ${contributor.commits}`)
			contributionEl.setAttribute("aria-label", window.i18nStrings.nCommits.replace("-1", contributor.commits))
			detailsEl.appendChild(contributionEl)
		}

		// Contributor icon
		let iconEl		
		iconEl = document.createElement("img")
		iconEl.className = "contributor-icon"
		iconEl.src = contributor.avatar_url
		iconEl.alt = window.i18nStrings.nProfilePicture.replace("PLACEHOLDER", contributor.login)

		// Contributor info wrapper
		let infoWrap = document.createElement("div")
		infoWrap.className = "contributor-info"
		infoWrap.appendChild(nameEl)
		infoWrap.insertAdjacentHTML("beforeend", " ")
		infoWrap.appendChild(detailsEl)

		// Link wrapper
		let linkEl = document.createElement("a")
		linkEl.target = "_blank"
		linkEl.href = contributor.profile ? contributor.profile : `https://github.com/${contributor.login}`
		linkEl.appendChild(iconEl)
		linkEl.appendChild(infoWrap)

		// Label that explains the contributor (accessibility)
		let contributorLabel = contributor.login
		// let contributorLabel = `${contributor.login} `
		// if (contributor.contributions) contributorLabel += `contributes on ${joinAnd(contributor.contributions)}`
		// if (contributor.contributions && contributor.commits) contributorLabel += " and "
		// if (contributor.commits) contributorLabel += `created ${contributor.commits} commit${contributor.commits === 1 ? "" : "s"}`
		
		// Contributor wrapper (wraps link wrapper)
		let wrapEl = document.createElement("div")
		wrapEl.className = "contributor col-12 col-sm-6 col-md-4 col-xl-3"
		wrapEl.setAttribute("aria-label", contributorLabel)
		wrapEl.appendChild(linkEl)

		// if (value % 4 === 0) {
		// 	let rowEl = document.createElement("div")
		// 	rowEl.className = "row"
		// 	document.querySelector("#account").appendChild(rowEl)
		// }

		// Appends the contributor wrapper to the row element
		document.querySelector("#contributors-showcase").appendChild(wrapEl)

	});

	if (window.twemojiReparse) window.twemojiReparse()
}

run()
