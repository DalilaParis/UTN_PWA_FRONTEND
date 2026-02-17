import { http } from "../utils/http"

export async function getMessages(workspace_id, channel_id) {
    return await http.get(`/api/workspace/${workspace_id}/channels/${channel_id}/messages`)
}

export async function createMessage(workspace_id, channel_id, content) {
    return await http.post(`/api/workspace/${workspace_id}/channels/${channel_id}/messages`, { content })
}
