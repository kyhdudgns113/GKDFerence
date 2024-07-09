export const getJwtFromHeader = (headers: any) => {
  if (!headers || !headers.authorization) {
    return null
  }

  return headers.authorization.split(' ')[1]
}
