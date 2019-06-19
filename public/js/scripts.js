const paginationDiv = document.querySelector('.pagination');
const paginationLinks = document.querySelectorAll('.pagination a'); 


// event listener to add an active class to a clicked link
for (let i = 0; i < paginationLinks.length; i++) {
    paginationLinks[i].addEventListener('click', () => {

        // mark that link as “active”
        paginationLinks[i].className = 'active';
    });
}

