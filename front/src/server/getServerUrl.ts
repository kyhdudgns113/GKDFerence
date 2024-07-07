export const getServerUrl = (path: string) => {
  const host = 'http://127.0.0.1:4000'
  return [host, path].join('')
}
