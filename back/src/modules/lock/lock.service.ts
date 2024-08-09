import {Injectable, Logger} from '@nestjs/common'

export type CheckReadyLockType = 'miss' | 'right now' | 'ready' | 'never'

// FUTURE: ready = now + 1 일 경우, 너무 오래 기다리면 문제가 생겼다는걸 알려보자
@Injectable()
export class LockService {
  private lockInfo: {[key: string]: {readyNumber: number; nowNumber: number}} = {}
  private refreshDurationMilliSecond: number = 10
  private maximumHoldingLockTimeMilliSecond: number = 10000
  private logger = new Logger('LockService')

  constructor() {}

  /**
   *
   * @param readyLock
   * @returns 'miss' : 다양한 이유로 순번이 지나갔다.
   *          'right now' : 지금 해당 순번이다.
   *          'ready' : 아직 순번이 오지 않았다.
   *          'never' : 해당 key 는 생성되지도 않았다. 이런 경우가 있을까 싶다.
   */
  checkReadyLockWithNowNumber(readyLock: string): CheckReadyLockType {
    const {readyNumber, key} = this.decodeReadyLockToNumberAndKey(readyLock)

    // NOTE: 해당 key 가 없다는건 readyNumber 가 생성되지도 않았다는 뜻이다.
    if (!this.lockInfo[key]) {
      return 'never'
    }

    if (this.lockInfo[key].nowNumber > readyNumber) {
      return 'miss'
    } // BLANK LINE COMMENT:
    else if (this.lockInfo[key].nowNumber === readyNumber) {
      return 'right now'
    } // BLANK LINE COMMENT:
    else {
      return 'ready'
    }
  }

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

    const retReadyLock = this.encodeReturnString(key, thisReadyNumber)

    // this.logger.log(`start : ${thisReadyNumber} / ${this.lockInfo[key].nowNumber}`)

    const newPromise = new Promise<string>((resolve, reject) => {
      const intervalId = setInterval(() => {
        const nowNumber = this.lockInfo[key].nowNumber
        const readyNumber = thisReadyNumber

        if (readyNumber > nowNumber) {
          // LOCKED:
        } // BLANK LINE COMMENT:
        else if (readyNumber === nowNumber) {
          clearInterval(intervalId)

          // NOTE: 연결 해제등의 이유로 lock 을 너무 오래 가지고 있을 수 있다.
          // NOTE: 이 경우 자동으로 해제해줘야 한다.
          setTimeout(() => {
            this.releaseLock(retReadyLock)
          }, this.maximumHoldingLockTimeMilliSecond)
          resolve(retReadyLock)
        } // BLANK LINE COMMENT:
        else {
          clearInterval(intervalId)
          reject(retReadyLock)
        }
      }, this.refreshDurationMilliSecond)
    })

    return newPromise
  }

  // FUTURE: lockData 를 적당한걸 넣어줘야 한다.
  async releaseLock(readyLock: string) {
    const {readyNumber, key} = this.decodeReadyLockToNumberAndKey(readyLock)
    if (!this.lockInfo[key]) {
      this.logger.log(`lock ${key} isn't exist`)
    } // BLANK LINE COMMENT:
    else if (this.lockInfo[key].nowNumber === readyNumber) {
      this.lockInfo[key].nowNumber += 1
    } // BLANK LINE COMMENT:
    else {
      // NOTE: 이것도 정상기능이라 간주한다.
      // NOTE: 대기순번이 지나고나서 락을 해제하는 경우이다.
      // NOTE: 아무것도 하지 않는다.
    }
  }

  // AREA1: PRIVATE FUNCTION AREA

  private decodeReadyLockToNumberAndKey(readyLock: string) {
    const [readyNumberString, key] = readyLock.split('___')
    return {readyNumber: parseInt(readyNumberString), key: key}
  }

  private encodeReturnString(key: string, readyNumber: number) {
    return readyNumber.toString() + '___' + key
  }

  private initLock(key: string) {
    this.lockInfo[key] = {
      readyNumber: 0,
      nowNumber: 0
    }
  }

  // BLANK LINE COMMENT
}
