import {Setter, SocketDocChangeType} from '../../../common'

export const onSetChangeQWhenReceiveInfo = (
  setChangeQ: Setter<SocketDocChangeType[]>,
  _payload: SocketDocChangeType
) => {
  setChangeQ(prev => {
    const newPrev = prev.map(element => {
      // Error case.
      if (!_payload.startRow || !_payload.endRow || !element.startRow || !element.endRow) {
        return element
      }
      if (_payload.whichChanged === 'title' && element.whichChanged === 'title') {
        element.startRow = null
        element.endRow = null
        return element
      }
      const payloadStart = _payload.startRow
      const payloadEnd = _payload.endRow
      const payloadLen = _payload.contents?.length || 0
      const payloadContents = _payload.contents ?? []
      const elementStart = element.startRow
      const elementEnd = element.endRow
      const elementLen = element.contents?.length || 0
      const elementContents = element.contents ?? []

      // Case 1. payload 의 삭제기능이 사라진 경우.
      //          element 도 삭제기능이 사라진 경우를 포함한다.
      if (payloadStart > payloadEnd) {
        // Case 1.1. 둘 다 똑같은 위치에서 삭제기능이 사라진 경우
        if (payloadStart === elementStart && payloadEnd === elementEnd) {
          element.endRow = elementStart + payloadLen - 1
          element.contents = [...payloadContents, ...elementContents]
          return element
        }
        // Case 1.2. element 다음에 payload 가 있으며 payload 안 사라질 때
        else if (elementEnd < payloadStart) {
          const deltaPayload = elementEnd - elementStart + elementLen
          _payload.startRow += deltaPayload
          _payload.endRow += deltaPayload
          return element
        }
        // Case 1.3. payload 다음에 element 가 있으며 payload 안 사라질때
        else if (payloadStart <= elementStart) {
          const deltaElement = payloadLen
          element.startRow += deltaElement
          element.endRow += deltaElement
          return element
        }
        // Case 1.4. payload 가 element 안에 포함되어 사라질 때
        else {
          const deltaElement = payloadLen
          _payload.startRow = null
          _payload.endRow = null
          element.endRow += deltaElement
          return element
        }
      }

      // Case 2. element 의 삭제기능만 사라진 경우
      //          payload 는 삭제기능 멀쩡하다
      if (elementStart > elementEnd) {
        // Case 2.1. payload 다음에 element 있고 안 사라지는 경우
        if (payloadEnd < elementStart) {
          const deltaElement = payloadLen
          element.startRow += deltaElement
          element.endRow += deltaElement
          return element
        }
        // Case 2.2. element 다음에 payload 가 있고 안 사라지는 경우우
        else if (elementStart <= payloadStart) {
          const deltaPayload = elementLen
          _payload.startRow += deltaPayload
          _payload.endRow += deltaPayload
          return element
        }
        // Case 2.3 element 사라지는 경우
        else {
          const deltaPayload = elementLen
          element.startRow = null
          element.endRow = null
          _payload.endRow += deltaPayload
          return element
        }
      }

      // Case 3. payload, element 삭제기능 살아있는 경우
      // Case 3.1 PPEE 일때, 철저히 미 포함
      if (payloadEnd < elementStart) {
        const deltaElement = payloadEnd - payloadStart + payloadLen
        element.startRow += deltaElement
        element.endRow += deltaElement
        return element
      }
      // Case 3.2. P===E, [...P.contents, ...E.contents] 로 한다.
      else if (payloadStart === elementStart && payloadEnd === elementEnd) {
        _payload.endRow = payloadStart - 1
        element.endRow = payloadStart + payloadLen - 1
        element.contents = [...payloadContents, ...elementContents]
        return element
      }
      // Case 3.3. PEEP 일 때, E가 포함되며 더 작음.
      else if (payloadStart <= elementStart && elementEnd <= payloadEnd) {
        const deltaPayload = elementLen
        element.startRow = null
        element.endRow = null
        _payload.endRow += deltaPayload
        return element
      }
      // Case 3.4. EPPE, E가 P 를 포함
      else if (elementStart <= payloadStart && payloadEnd <= elementEnd) {
        const deltaElement = payloadLen
        _payload.startRow = null
        _payload.endRow = null
        element.endRow += deltaElement
        return element
      }
      // Case 3.5. PEPE 일 때, 교집합, 차집합 존재함
      else if (payloadStart <= elementStart && payloadEnd <= elementEnd) {
        _payload.endRow = elementStart - 1
        element.startRow = payloadEnd + 1
        return element
      }
      // Case 3.6. EPEP
      else if (elementStart <= payloadStart && elementEnd <= payloadEnd) {
        _payload.startRow = elementEnd + 1
        element.endRow = payloadStart - 1
        return element
      }
      // Case 3.7. EEPP
      else {
        const deltaPayload = elementEnd - elementStart + elementLen
        _payload.startRow += deltaPayload
        _payload.endRow += deltaPayload
        return element
      }
    })
    return newPrev
  })
}
