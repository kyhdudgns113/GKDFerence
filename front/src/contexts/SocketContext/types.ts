/***********************************************************************
 *
 * UserConnectType don't have to include jwt.
 * Because when client is rendering, it check jwt token automatically.
 *
 ***********************************************************************/
export type SocketUserConnectedType = {
  id: string
}
export type SocketTestCountType = {
  id: string
  cnt: number
}
