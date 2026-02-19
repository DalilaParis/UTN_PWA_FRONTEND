import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import useRequest from './useRequest'
import { getMessages, createMessage } from '../services/channelService'

const useChannel = (channelId) => {
    const { workspace_id } = useParams()
    const [messages, setMessages] = useState([])
    const [hasFetchedOnce, setHasFetchedOnce] = useState(false)
    const [prevChannelId, setPrevChannelId] = useState(channelId)

    if (channelId !== prevChannelId) {
        setPrevChannelId(channelId)
        setHasFetchedOnce(false)
    }

    const messagesRequest = useRequest()
    const sendMessageRequest = useRequest()

    const fetchMessages = async () => {
        if (!channelId || !workspace_id) return
        try {
            const data = await messagesRequest.sendRequest(() => getMessages(workspace_id, channelId))
            setMessages(data.data.messages)
            setHasFetchedOnce(true)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 1000)
        return () => clearInterval(interval)
    }, [workspace_id, channelId])

    const handleSendMessage = async (content) => {
        try {
            await sendMessageRequest.sendRequest(() => createMessage(workspace_id, channelId, content))
            fetchMessages()
        } catch (err) {
            console.error(err)
        }
    }

    return {
        messages,
        loading: messagesRequest.loading,
        error: messagesRequest.error,
        sendMessage: handleSendMessage,
        sending: sendMessageRequest.loading,
        hasFetchedOnce
    }
}

export default useChannel
