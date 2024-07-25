export const decodeJwtFromServer = (jwtFromServer: string | undefined) => {
  if (!jwtFromServer) {
    return {
      header: '',
      jwtBody: ''
    }
  }
  const header = jwtFromServer.slice(0, 3)
  const jwtBody = jwtFromServer.slice(3, jwtFromServer.length)

  return {header, jwtBody}
}

export const encodeJwtFromClient = (header: string, jwtBody: string) => {
  return header + jwtBody + header
}
