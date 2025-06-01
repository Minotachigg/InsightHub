import { API } from "../config"

// ADD TOPIC
export const addTopic = ( token, topic) => {
    return fetch(`${API}/posttopic`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(topic)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
}