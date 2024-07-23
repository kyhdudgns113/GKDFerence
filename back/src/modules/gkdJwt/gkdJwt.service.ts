import {Injectable} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {gkdJwtSignOption, JwtPayload} from 'src/common'

@Injectable()
export class GkdJwtService {
  private secretLength: number = 3
  constructor(private jwtService: JwtService) {}

  async sign(payload: JwtPayload) {
    const jwt = await this.jwtService.signAsync(payload, gkdJwtSignOption)
    const header = this.generateRandomString()
    return header + jwt
  }

  /**
   * @param jwtFromClient
   * @returns {header, jwtTest}
   */
  async refreshPhase1(jwtFromClient: string) {
    const {header, jwt, footer} = this.decodeJwtFromClient(jwtFromClient)

    if (!this.validateHeaderFooter(header, footer)) {
      return null
    }

    try {
      const res = (await this.jwtService.verifyAsync(jwt)) as JwtPayload
      const newJwt = await this.jwtService.signAsync(res, gkdJwtSignOption)
      const newHeader = this.generateRandomString()
      const jwtTest = newHeader + newJwt
      return {header: newHeader, jwtTest}
    } catch (err) {
      return null
    }
  }

  async refreshPhase2(jwtFromClient: string) {
    return this.refreshPhase1(jwtFromClient)
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
}
