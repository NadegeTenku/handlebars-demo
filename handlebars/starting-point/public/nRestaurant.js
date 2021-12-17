const deleteBtn = document.querySelector('#delete-btn')  //find the delete-button in the document
const likeBtn = document.querySelector('#like-btn')  //find the like button in the document
const likeCounter = document.querySelector('#like-counter')
const dislikeBtn = document.querySelector('#dislike-btn')
const dislikeCounter = document.querySelector('#dislike-counter')
const id = window.location.pathname.split('/nRestaurants/')[1]  //get the current restoID from the url
//const deleteBtn = document.getElementById('action') // the same as #delete-btn

console.log(id)

deleteBtn.addEventListener('click', async () => {
    let res = await fetch(`/nRestaurants/${id}`, {  //fetch sauce route for this id with the delete method
        method: 'DELETE'
    })
        console.log(res)
        window.location.assign('/nRestaurants')  //send user back to the resto path
})

likeBtn.addEventListener('click', async () => {  //add an event to like this resto
    let currentLikes = parseInt(likeCounter.innerHTML)
    console.log(currentLikes)
    currentLikes += 1
    likeCounter.innerHTML = currentLikes
    let res = await fetch(`/nRestaurants/${id}`, {  //fetch the route for this id with PUT method
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
        },
         body: JSON.stringify({
            likes: currentLikes
        })
    })
})

dislikeBtn.addEventListener('click', async () => {  //add an event to dislike this resto
    let currentDislikes = parseInt(dislikeCounter.innerHTML)
    console.log(currentDislikes)
    currentDislikes += 1
    dislikeCounter.innerHTML = currentDislikes
    let res = await fetch(`/nRestaurants/${id}`, {  //fetch the route for this id with PUT method
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
        },
         body: JSON.stringify({
            dislikes: currentDislikes
        })
    })
})