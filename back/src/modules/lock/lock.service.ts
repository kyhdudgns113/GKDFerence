import {Injectable, Logger} from '@nestjs/common'

// FUTURE: ready = now + 1 일 경우, 너무 오래 기다리면 문제가 생겼다는걸 알려보자
@Injectable()
export class LockService {
  private lockInfo: {[key: string]: {readyNumber: number; nowNumber: number}} = {}
  private refreshDurationMilliSecond: number = 10
  private logger = new Logger('LockService')

  constructor() {}

  /**
   * @param key 어떤 키워드의 lock 을 걸 것인지 입력한다.
   * @returns : await 를 쓰면 알아서 lock 얻을때까지 기다려준다. 이 리턴값을 releaseLock 할 때 넣어준다.
   */
  async readyLock(key: string) {
    if (!this.lockInfo[key]) {
      this.initLock(key)
    }

    const thisReadyNumber = this.lockInfo[key].readyNumber
    this.lockInfo[key].readyNumber += 1

    const retReadyLock = thisReadyNumber.toString() + '___' + key

    // this.logger.log(`start : ${thisReadyNumber} / ${this.lockInfo[key].nowNumber}`)

    const newPromise = new Promise<string>((resolve, reject) => {
      const intervalId = setInterval(() => {
        const nowNumber = this.lockInfo[key].nowNumber
        const readyNumber = thisReadyNumber

        if (readyNumber > nowNumber) {
          // LOCKED:
        } else if (readyNumber === nowNumber) {
          clearInterval(intervalId)
          resolve(retReadyLock)
        } else {
          clearInterval(intervalId)
          reject(retReadyLock)
        }
      }, this.refreshDurationMilliSecond)
    })

    return newPromise
  }

  // FUTURE: lockData 를 적당한걸 넣어줘야 한다.
  async releaseLock(readyLock: string) {
    const [readyNumberString, key] = readyLock.split('___')
    if (!this.lockInfo[key]) {
      this.logger.log(`lock ${key} isn't exist`)
    } else if (this.lockInfo[key].nowNumber === parseInt(readyNumberString)) {
      this.lockInfo[key].nowNumber += 1
    } else {
      this.logger.log(
        `readyNumber incorrect in ${key} : ${readyNumberString} / ${this.lockInfo[key].nowNumber}`
      )
    }
  }

  private initLock(key: string) {
    this.lockInfo[key] = {
      readyNumber: 0,
      nowNumber: 0
    }
  }

  // BLANK LINE COMMENT
}
