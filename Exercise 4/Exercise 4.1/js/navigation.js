
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');

    pages.forEach(page => {
        page.classList.remove('active');  //remove the 'active' class from all pages to hide them   
    });

    document.getElementById(pageId).classList.add('active'); //add the 'active' class to the selected page to show it   
}