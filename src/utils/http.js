import { ServerError } from "./errorUtils"

const URL_API = import.meta.env.VITE_API_URL

const getHeaders = () => {
    return {
        'x-api-key': import.meta.env.VITE_API_KEY,
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('auth_token'),
    }
}

export const http = {
    get: async (endpoint) => {
        const response_http = await fetch(
            URL_API + endpoint,
            {
                method: 'GET',
                headers: getHeaders(),
            }
        )
        const response = await response_http.json()
        if (!response.ok) {
            throw new ServerError(response.message, response.status)
        }
        return response
    },
    post: async (endpoint, body) => {
        const response_http = await fetch(
            URL_API + endpoint,
            {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(body)
            }
        )
        const response = await response_http.json()
        if (!response.ok) {
            throw new ServerError(response.message, response.status)
        }
        return response
    },
    put: async (endpoint, body) => {
        const response_http = await fetch(
            URL_API + endpoint,
            {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(body)
            }
        )
        const response = await response_http.json()
        if (!response.ok) {
            throw new ServerError(response.message, response.status)
        }
        return response
    },
    patch: async (endpoint, body) => {
        const response_http = await fetch(
            URL_API + endpoint,
            {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(body)
            }
        )
        const response = await response_http.json()
        if (!response.ok) {
            throw new ServerError(response.message, response.status)
        }
        return response
    },
    delete: async (endpoint) => {
        const response_http = await fetch(
            URL_API + endpoint,
            {
                method: 'DELETE',
                headers: getHeaders(),
            }
        )
        const response = await response_http.json()
        if (!response.ok) {
            throw new ServerError(response.message, response.status)
        }
        return response
    },
}
