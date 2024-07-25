import {Injectable} from '@nestjs/common'
import {JwtService, JwtSignOptions} from '@nestjs/jwt'
import {gkdJwtSignOption, JwtPayload} from 'src/common'

@Injectable()
export class GkdJwtService {
  private secretLength: number = 3
  private uOIdToHeader: {[uOId: string]: string} = {}
  constructor(private jwtService: JwtService) {}

  async signAsync(payload: JwtPayload, options: JwtSignOptions) {
    const jwt = await this.jwtService.signAsync(payload, options)
    const header = this.generateRandomString()
    return header + jwt
  }

  async verifyAsync(jwtFromServer: string) {
    try {
      const {jwt} = this.decodeJwtFromClient(jwtFromServer)
      await this.jwtService.verifyAsync(jwt)
    } catch (error) {
      throw ''
    }
  }

  /**
   * @param jwtFromClient
   * @returns header 및 client 로 전송할 encodedJwt
   */
  async refreshPhase1(jwtFromClient: string) {
    const {header, jwt, footer} = this.decodeJwtFromClient(jwtFromClient)

    if (!this.validateHeaderFooter(header, footer)) {
      return ''
    }

    try {
      const payload = (await this.jwtService.verifyAsync(jwt)) as JwtPayload
      const newJwt = await this.jwtService.signAsync(payload, gkdJwtSignOption)
      const uOId = payload.uOId

      const newHeader = this.generateRandomString()
      const encodedJwt = this.encodeJwtFromServer(newJwt, newHeader)

      this.uOIdToHeader[uOId] = newHeader

      return encodedJwt
    } catch (err) {
      return ''
    }
  }

  async refreshPhase2(jwtFromClient: string) {
    const {header, jwt, footer} = this.decodeJwtFromClient(jwtFromClient)

    try {
      const payload = (await this.jwtService.verifyAsync(jwt)) as JwtPayload
      const uOId = payload.uOId

      if (!this.validateHeaderFooter2(header, footer, uOId)) {
        return ''
      }

      const newJwt = await this.jwtService.signAsync(payload, gkdJwtSignOption)

      const newHeader = this.generateRandomString()
      const encodedJwt = this.encodeJwtFromServer(newJwt, newHeader)
      delete this.uOIdToHeader[uOId]

      return encodedJwt
    } catch (err) {
      return ''
    }
  }

  // AREA1 : Private function Area
  generateRandomString() {
    const chrs: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let res: string = ''

    for (let i = 0; i < this.secretLength; i++) {
      res += chrs.charAt(Math.floor(Math.random() * chrs.length))
    }

    return res
  }

  encodeJwtFromServer(jwt: string, secret: string) {
    return secret + jwt
  }

  decodeJwtFromClient(jwtFromClient: string) {
    if (jwtFromClient.length < 2 * this.secretLength) {
      return {
        header: '',
        jwt: '',
        footer: ''
      }
    }

    const secLen = this.secretLength
    const jwtLen = jwtFromClient.length
    const header = jwtFromClient.slice(0, secLen)
    const footer = jwtFromClient.slice(jwtLen - secLen, jwtLen)
    const jwt = jwtFromClient.slice(secLen, jwtLen - secLen)

    return {header, jwt, footer}
  }

  validateHeaderFooter(header: string, footer: string) {
    return header === footer
  }

  validateHeaderFooter2(header: string, footer: string, uOId: string) {
    return header === footer && this.uOIdToHeader[uOId] === header
  }
}
