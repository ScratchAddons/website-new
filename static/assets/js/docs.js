// Add scroll spy for table of contents (the thing that bolds the current section)
scrollSpy('#TableOfContents', {
	sectionClass: 'h2, h3, h4, h5, h6',
	menuActiveTarget: '#TableOfContents a',
	offset: -50,
})