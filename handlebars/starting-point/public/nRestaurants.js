//onclick function to delete a resto by id
async function deleteRestaurant(id){
    let res = await fetch(`/nRestaurants/${id}` ,{  //delete a resto matching parameter id
        method: 'DELETE'
    })
    console.log(res)
    window.location.assign('/nRestaurants')  //send user back to the restos path
}