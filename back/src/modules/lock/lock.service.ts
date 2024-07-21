import {Injectable} from '@nestjs/common'

@Injectable()
export class LockService {
  private lockInfo: {[key: string]: {readyNumber: number; nowNumber: number}} = {}
  private refreshDurationMilliSecond: number = 3000

  constructor() {}

  async getLock(key: string) {
    if (!this.lockInfo[key]) {
      this.initLock(key)
    }

    const thisReadyNumber = this.lockInfo[key].readyNumber
    this.lockInfo[key].readyNumber += 1

    console.log(`start : ${thisReadyNumber} / ${this.lockInfo[key].nowNumber}`)

    const newPromise = new Promise<number>((resolve, reject) => {
      const intervalId = setInterval(() => {
        const nowNumber = this.lockInfo[key].nowNumber
        const readyNumber = thisReadyNumber

        if (readyNumber > nowNumber) {
          console.log(`ready lock : ${readyNumber} / ${nowNumber}`)
        } else if (readyNumber === nowNumber) {
          console.log(`get Lock : ${readyNumber}`)

          clearInterval(intervalId)
          resolve(readyNumber)
        } else {
          clearInterval(intervalId)
          reject(readyNumber)
        }
      }, this.refreshDurationMilliSecond)
    })

    return newPromise
  }

  // FUTURE: lockData 를 적당한걸 넣어줘야 한다.
  async releaseLock(key: string, lockData: any) {
    this.lockInfo[key].nowNumber += 1
  }

  private initLock(key: string) {
    this.lockInfo[key] = {
      readyNumber: 0,
      nowNumber: 0
    }
  }

  // BLANK LINE COMMENT
}
