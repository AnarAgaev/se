import { TRoomItem, TRoomList } from '../types'

export const getRoomStatusById = (payload: {rooms: TRoomList, roomId: TRoomItem['id']}) => {

	const { rooms, roomId} = payload

	const room = rooms.find(r => r.id === roomId)

	return room?.default ?? false
}
