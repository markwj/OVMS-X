import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Message {
  type: string
  params: string
}

// Global WebSocket reference for manual control
let globalWs: WebSocket | null = null;

export const ovmsv2wsApi = createApi({
  refetchOnFocus: false,        // Fetch when app gains focus
  refetchOnReconnect: true,     // Fetch on network reconnection
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], { serverurl: string, username: string, password: string, vehicleid: string }>({
      query: ({ serverurl, username, password, vehicleid }) => `messages/`,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // create a websocket connection when the cache subscription starts
        console.log('[ovmsv2wsApi] connecting to', arg.serverurl)
        const ws = new WebSocket(arg.serverurl)
        globalWs = ws // Store reference for manual control
        
        // Send authentication message when connection opens
        
        const openListener = () => {
          const authMessage = `MP-A 1 ${arg.username} ${arg.password} ${arg.vehicleid}`
          console.log('[ovmsv2wsApi] Sending auth message:', authMessage)
          ws.send(authMessage)
        }
        
        const messageListener = (event: MessageEvent) => {
          const parts = event.data.split(' ')
          const type = parts[0]
          const params = parts.slice(1).join(' ')
          console.log('[ovmsv2wsApi] rx event data', type, params)
          const data: Message = { type, params }
          updateCachedData((draft) => {
            draft.push(data)
          })
        }

        ws.addEventListener('open', openListener)
        ws.addEventListener('message', messageListener)
        
        // Don't wait for cacheDataLoaded since we're not making an HTTP request
        // Just wait for cacheEntryRemoved to clean up
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        console.log('[ovmsv2wsApi] Closing websocket')
        ws.close()
        globalWs = null // Clear global reference
      },
    }),
  })
})

export const {
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
} = ovmsv2wsApi

// Function to manually close the WebSocket
export const closeWebSocket = () => {
  if (globalWs) {
    console.log('[ovmsv2wsApi] Manually closing websocket')
    globalWs.close()
    globalWs = null
  }
}
