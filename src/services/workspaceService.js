import { http } from "../utils/http"

export async function getWorkspaceList() {
    return await http.get('/api/workspace')
}

export async function createWorkspace(workspace_data) {
    return await http.post('/api/workspace', workspace_data)
}

export async function getWorkspaceById(workspace_id) {
    return await http.get(`/api/workspace/${workspace_id}`)
}

export async function getChannels(workspace_id) {
    return await http.get(`/api/workspace/${workspace_id}/channels`)
}

export async function createChannel(workspace_id, name) {
    return await http.post(`/api/workspace/${workspace_id}/channels`, { name })
}

export async function inviteUser(workspace_id, email) {
    return await http.post(`/api/workspace/${workspace_id}/members`, { email, role: 'User' })
}

export async function getMembers(workspace_id) {
    return await http.get(`/api/workspace/${workspace_id}/members`)
}

export async function deleteWorkspace(workspace_id) {
    return await http.delete(`/api/workspace/${workspace_id}`)
}