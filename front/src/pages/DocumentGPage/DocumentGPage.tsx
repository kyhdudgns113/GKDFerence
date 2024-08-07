import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {Button, Title} from '../../components'
import {useAuth, useDocumentGContext} from '../../contexts'
import {DocContentType} from '../../common'

export default function DocumentGPage() {
  /* eslint-disable */
  const {dOId, title, contents, addInfoToChangeQ, onBlurTitle, onChangeTitle, setContents} =
    useDocumentGContext()
  const {uOId} = useAuth()

  const [contentsLen, setContentsLen] = useState<number>(0)
  const [contentLastRow, setContentLastRow] = useState<DocContentType>('')
  const [cursorAfterRender, setCursorAfterRender] = useState<number | null>(null)
  // focusRow : onFocus 실행됬을때만 설정된다.
  // focusRowAfterRender : 이거 설정되고 렌더링되면 focus 가 바뀌도록 했다.
  // 둘이 엄연히 다르다.
  const [focusRow, setFocusRow] = useState<number | null>(null)
  const [focusRowAfterRender, setFocusRowAfterRender] = useState<number | null>(null)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false)
  const [isMouseOutAndPressed, setIsMouseOutAndPressed] = useState<boolean>(false)
  const [isSelectionActivated, setIsSelectionActivated] = useState<boolean>(false)
  const [mouseDownRow, setMouseDownRow] = useState<number | null>(null)
  const [mouseUpRow, setMouseUpRow] = useState<number | null>(null)
  const [mouseOverRow, setMouseOverRow] = useState<number | null>(null)
  // rangeStartRow : min(selectionRowStart, End)
  // 선택한 범위의 윗 부분 index 이다.
  const [rangeStartRow, setRangeStartRow] = useState<number | null>(null)
  const [rangeEndRow, setRangeEndRow] = useState<number | null>(null)
  // selectionRowStart : 선택을 시작한 부분의 row
  const [selectionRowStart, setSelectionRowStart] = useState<number | null>(null)
  const [selectionRowEnd, setSelectionRowEnd] = useState<number | null>(null)
  const [shiftMouseDownRow, setShiftMouseDownRow] = useState<number | null>(null)
  const [shiftKeyboardSelectEndRow, setShiftKeyboardSelectEndRow] = useState<number | null>(null)

  // contents 가 변했을때 바꾼다.
  const [startRow, setStartRow] = useState<number | null>(null)
  const [endRow, setEndRow] = useState<number | null>(null)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const divRefs = useRef<(HTMLDivElement | null)[]>([])
  /* eslint-enable */

  const onClickTest = useCallback((e: MouseEvent) => {
    //
  }, [])

  // AREA1: Div Page Area
  const onDragEnterPage = useCallback((e: MouseEvent) => {
    // 이거 해줘야 onDropPage 가 실행된다.
    e.preventDefault()
  }, [])
  const onDragOverPage = useCallback((e: MouseEvent) => {
    // 이거 해줘야 onDropPage 가 실행된다.
    e.preventDefault()
  }, [])
  const onDropPage = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setIsMousePressed(false)
    setMouseUpRow(null)
  }, [])
  const onMouseDownPage = useCallback((e: MouseEvent) => {
    setIsMousePressed(true)
    setMouseDownRow(null)
    setShiftMouseDownRow(null)
  }, [])
  const onMouseOverPage = useCallback((e: MouseEvent) => {
    setMouseOverRow(null)
  }, [])
  const onMouseUpPage = useCallback((e: MouseEvent) => {
    setIsMousePressed(false)
    setMouseUpRow(null)
  }, [])

  // AREA2: onKeyDownInput Area
  const onKeyDownInput_ArrowUp = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.shiftKey) {
        if (isSelectionActivated && selectionRowEnd !== null && selectionRowEnd > 0) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(selectionRowEnd - 1)
        } // BLANK LINE COMMENT:
        else if (!isSelectionActivated && index > 0) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(index - 1)
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      }
      // shift 안 눌렸을 때
      else {
        const newCursor =
          e.currentTarget.selectionDirection === 'forward'
            ? e.currentTarget.selectionEnd
            : e.currentTarget.selectionStart
        if (isSelectionActivated) {
          e.preventDefault()
          setFocusRowAfterRender(rangeStartRow)
          setCursorAfterRender(0)
          setSelectionRowEnd(null)
        } // BLANK LINE COMMENT:
        else if (index > 0) {
          e.preventDefault()
          setFocusRowAfterRender(index - 1)
          setCursorAfterRender(newCursor)
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      }
    },
    [isSelectionActivated, rangeStartRow, selectionRowEnd]
  )
  const onKeyDownInput_ArrowDown = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.shiftKey) {
        if (isSelectionActivated && selectionRowEnd !== null && selectionRowEnd < contentsLen) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(selectionRowEnd + 1)
        } // BLANK LINE COMMENT:
        else if (!isSelectionActivated && index < contentsLen) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(index + 1)
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      } // BLANK LINE COMMENT:
      // shift 안 눌렸을 때
      else {
        const newCursor =
          e.currentTarget.selectionDirection === 'forward'
            ? e.currentTarget.selectionEnd
            : e.currentTarget.selectionStart
        if (isSelectionActivated) {
          const rangeEndRowContent = contents && contents[rangeEndRow || index]
          e.preventDefault()
          setFocusRowAfterRender(rangeEndRow)
          setCursorAfterRender(rangeEndRowContent ? rangeEndRowContent.length : 0)
          setSelectionRowEnd(null)
        } // BLANK LINE COMMENT:
        else if (index < contentsLen) {
          e.preventDefault()
          setFocusRowAfterRender(index + 1)
          setCursorAfterRender(newCursor)
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      }
    },
    [contents, contentsLen, isSelectionActivated, rangeEndRow, selectionRowEnd]
  )
  const onKeyDownInput_ArrowLeft = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const selStart = e.currentTarget.selectionStart
      const selEnd = e.currentTarget.selectionEnd
      if (e.shiftKey) {
        if (isSelectionActivated && selectionRowEnd !== null && selectionRowEnd > 0) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(selectionRowEnd - 1)
        } // BLANK LINE COMMENT:
        else if (!isSelectionActivated && index > 0 && selStart === 0) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(index - 1)
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      } // BLANK LINE COMMENT:
      // shift 안 누른 상태일 때
      else {
        if (isSelectionActivated) {
          e.preventDefault()
          setFocusRowAfterRender(rangeStartRow)
          setCursorAfterRender(0)
          setSelectionRowEnd(null)
        } // BLANK LINE COMMENT:
        // 커서가 맨 왼쪽에 있을 때
        else if (index > 0 && selStart === 0 && selEnd === 0) {
          e.preventDefault()
          setFocusRowAfterRender(index - 1)

          if (contents) {
            const upperContent = contents[index - 1]
            setCursorAfterRender(upperContent === null ? 0 : upperContent.length)
          } // BLANK LINE COMMENT:
          else {
            setCursorAfterRender(0)
          }
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      }
    },
    [contents, isSelectionActivated, rangeStartRow, selectionRowEnd]
  )
  const onKeyDownInput_ArrowRight = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      const selStart = e.currentTarget.selectionStart
      const selEnd = e.currentTarget.selectionEnd
      const nowContent = contents && contents[index]
      const nowContentLen = (nowContent && nowContent.length) || 0

      if (e.shiftKey) {
        if (isSelectionActivated && selectionRowEnd !== null && selectionRowEnd < contentsLen) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(selectionRowEnd + 1)
        } // BLANK LINE COMMENT:
        else if (!isSelectionActivated && index < contentsLen && selEnd === nowContentLen) {
          e.preventDefault()
          setShiftKeyboardSelectEndRow(index + 1)
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      } // BLANK LINE COMMENT:
      // shift 안 누른 상태일 때
      else {
        if (isSelectionActivated) {
          const rangeEndRowContent = contents && contents[rangeEndRow || index]
          e.preventDefault()
          setFocusRowAfterRender(rangeEndRow)
          setCursorAfterRender(rangeEndRowContent ? rangeEndRowContent.length : 0)
          setSelectionRowEnd(null)
        } // BLANK LINE COMMENT:
        // 커서가 맨 오른쪽에 있을 때
        else if (index < contentsLen && selStart === nowContentLen && selEnd === nowContentLen) {
          e.preventDefault()
          setFocusRowAfterRender(index + 1)

          if (contents) {
            const lowerContent = contents[index + 1]
            setCursorAfterRender(lowerContent === null ? 0 : lowerContent.length)
          } // BLANK LINE COMMENT:
          else {
            setCursorAfterRender(0)
          }
        } // BLANK LINE COMMENT:
        else {
          // DO NOTHING:
        }
      }
    },
    [contents, contentsLen, isSelectionActivated, rangeEndRow, selectionRowEnd]
  )

  // AREA3: input Element Area
  const onBlurInput = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setFocusRow(null)
      setIsChanged(false)
      if (isChanged && startRow !== null && endRow !== null) {
        if (index === contentsLen) {
          setContents(prev => {
            const newPrev = [...prev]
            newPrev.push(e.target.value)
            return newPrev
          })
          setContentLastRow(null)
        }
        addInfoToChangeQ('contents', startRow, endRow, [e.target.value])
      }
    },
    [contentsLen, isChanged, startRow, endRow, addInfoToChangeQ, setContents]
  )
  const onChangeInput = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      setIsChanged(true)
      setStartRow(rangeStartRow)
      setEndRow(rangeEndRow)
      if (index < contentsLen) {
        setContents(prev => {
          const newPrev = [...prev]
          newPrev[index] = e.target.value
          return newPrev
        })
      } //
      else {
        // 여기서 setContents 하면 커서 위치 오류가 난다.
        setContentLastRow(e.target.value)
      }
    },
    [contentsLen, rangeStartRow, rangeEndRow, setContents]
  )
  const onClickInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      // NOTE: 클릭 안하고 focus 가 들어오는 경우도 있다보니 가급적 여기서 뭐 하지 말자
    },
    []
  )
  const onDropInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.preventDefault()
      setIsMousePressed(false)
      setMouseUpRow(index)
    },
    []
  )
  const onFocusInput = useCallback(
    (index: number) => (e: FocusEvent) => {
      setFocusRow(index)
    },
    []
  )
  const onKeyDownInput = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      // NOTE: selection 이랑 상관 없이 돌아가는 경우에는 return 해준다.
      switch (e.key) {
        case 'ArrowUp':
          onKeyDownInput_ArrowUp(index)(e)
          return
        case 'ArrowDown':
          onKeyDownInput_ArrowDown(index)(e)
          return
        case 'ArrowLeft':
          onKeyDownInput_ArrowLeft(index)(e)
          return
        case 'ArrowRight':
          onKeyDownInput_ArrowRight(index)(e)
          return
      }

      if (isSelectionActivated) {
        // NOTE: shift 키는 눌려도 된다.
        if (!e.altKey && !e.ctrlKey && e.key.length === 1) {
          e.preventDefault()
          setIsChanged(true)
          setStartRow(rangeStartRow)
          setEndRow(rangeEndRow)
          setSelectionRowStart(null)
          setSelectionRowEnd(null)
          setContents(prev => {
            const newPrev = [...prev]
            const deleteLen = (rangeEndRow || index) - (rangeStartRow || index) + 1
            newPrev.splice(rangeStartRow || index, deleteLen, e.key)
            return newPrev
          })
          setFocusRowAfterRender(rangeStartRow)
          setCursorAfterRender(e.key.length)
        }
      }
    },
    [
      isSelectionActivated,
      rangeStartRow,
      rangeEndRow,
      onKeyDownInput_ArrowUp,
      onKeyDownInput_ArrowDown,
      onKeyDownInput_ArrowLeft,
      onKeyDownInput_ArrowRight,
      setContents
    ]
  )
  const onMouseDownInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setIsMousePressed(true)
      setMouseDownRow(index)
      if (e.shiftKey) {
        e.preventDefault()
        if (mouseDownRow !== index) {
          setShiftMouseDownRow(index)
        }
      } //
      else {
        setShiftMouseDownRow(null)
      }
    },
    [mouseDownRow]
  )
  const onMouseOutInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      if (isMousePressed) {
        setIsMouseOutAndPressed(true)
      }
    },
    [isMousePressed]
  )
  const onMouseOverInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setMouseOverRow(index)
    },
    []
  )
  const onMouseUpInput = useCallback(
    (index: number) => (e: MouseEvent) => {
      e.stopPropagation()
      setIsMousePressed(false)
      setMouseUpRow(index)
    },
    []
  )

  // Change focus after render
  useEffect(() => {
    if (focusRowAfterRender !== null && inputRefs) {
      const inputRef = inputRefs.current[focusRowAfterRender]
      if (inputRef) {
        inputRef.focus()
        inputRef.selectionStart = cursorAfterRender
        inputRef.selectionEnd = cursorAfterRender
      }
      setFocusRowAfterRender(null)
    }
  }, [cursorAfterRender, focusRowAfterRender, inputRefs])

  // Set contentsLen
  useEffect(() => {
    setContentsLen(contents ? contents.length : 0)
  }, [contents])

  // Set isMouseOutAndPressed false
  useEffect(() => {
    setIsMouseOutAndPressed(false)
  }, [focusRow])

  // Set isMouseOutAndPressed false 2
  useEffect(() => {
    if (!isMousePressed) {
      setIsMouseOutAndPressed(false)
    }
  }, [isMousePressed])

  // Set selectionRowStart
  useEffect(() => {
    setSelectionRowStart(focusRow)
    setSelectionRowEnd(null)
  }, [focusRow])

  // Set selectionRowEnd 1 : mouse without shift
  useEffect(() => {
    const selectionDrag = isMouseOutAndPressed && isMousePressed

    const justMouseDown = isMousePressed && !isMouseOutAndPressed
    const setNullCondition = justMouseDown || false
    if (selectionDrag) {
      setSelectionRowEnd(mouseOverRow)
    } else if (setNullCondition) {
      setSelectionRowEnd(null)
    }
  }, [
    isMouseOutAndPressed,
    isMousePressed,
    mouseOverRow,
    shiftKeyboardSelectEndRow,
    shiftMouseDownRow
  ])

  // Set selectionRowEnd 2 : shift + mouse
  useEffect(() => {
    if (shiftMouseDownRow !== null) {
      setSelectionRowEnd(shiftMouseDownRow)
    }
  }, [shiftMouseDownRow])

  // Set selectionRowEnd 3 : shift + keyboard
  useEffect(() => {
    if (shiftKeyboardSelectEndRow !== null) {
      setSelectionRowEnd(shiftKeyboardSelectEndRow)
      setShiftKeyboardSelectEndRow(null)
    }
  }, [shiftKeyboardSelectEndRow])

  // Set selection
  useEffect(() => {
    const selection = window.getSelection()
    if (selectionRowStart !== null && selectionRowEnd !== null && divRefs) {
      if (selection) {
        const range = document.createRange()

        const lowIndex = Math.min(selectionRowStart, selectionRowEnd)
        const highIndex = Math.max(selectionRowStart, selectionRowEnd)

        const divRefLow = divRefs.current[lowIndex]
        const divRefHigh = divRefs.current[highIndex]

        if (divRefLow !== null && divRefHigh !== null) {
          range.setStart(divRefLow, 0)
          range.setEnd(divRefHigh, 1)

          setRangeStartRow(lowIndex)
          setRangeEndRow(highIndex)

          setIsSelectionActivated(true)
        }

        selection.removeAllRanges()
        selection.addRange(range)
      }
    } //
    else {
      setIsSelectionActivated(false)
      // 이거 하면 focus 도 해제된다.
      // selection?.removeAllRanges()
    }
  }, [divRefs, selectionRowStart, selectionRowEnd])

  // Set rangeRowStart & And
  useEffect(() => {
    setRangeStartRow(focusRow)
    setRangeEndRow(focusRow)
  }, [focusRow])

  const classNameContent = ['outline-none w-full focus:bg-gkd-sakura-bg'].join(' ')

  const DocumentGContent = (index: number) => (
    <input
      className={classNameContent}
      key={`contents:${index}`}
      onBlur={onBlurInput(index)}
      onChange={onChangeInput(index)}
      onClick={onClickInput(index)}
      onDrop={onDropInput(index)}
      onFocus={onFocusInput(index)}
      onKeyDown={onKeyDownInput(index)}
      onMouseDown={onMouseDownInput(index)}
      onMouseOut={onMouseOutInput(index)}
      onMouseOver={onMouseOverInput(index)}
      onMouseUp={onMouseUpInput(index)}
      ref={el => (inputRefs.current[index] = el)}
      value={index < contentsLen ? (contents && contents[index]) || '' : contentLastRow || ''}
    />
  )

  return (
    <div
      className="flex flex-col items-center h-full "
      onDragEnter={onDragEnterPage}
      onDragOver={onDragOverPage}
      onDrop={onDropPage}
      onMouseDown={onMouseDownPage}
      onMouseOver={onMouseOverPage}
      onMouseUp={onMouseUpPage}>
      <Title>DocumentG Page</Title>
      <Title>MousePressed : {isMousePressed ? 'true' : 'false'}</Title>
      <Title>OutPressed : {isMouseOutAndPressed ? 'true' : 'false'}</Title>
      <Title>selection? : {isSelectionActivated ? 'True' : 'False'}</Title>
      <Title>selectionRow : {`${selectionRowStart}, ${selectionRowEnd}`}</Title>
      <Title>rangeRow : {`${rangeStartRow}, ${rangeEndRow}`}</Title>
      <input
        className="INPUT_TITLE border-2 text-gkd-sakura-text m-2 p-2 text-3xl w-1/3"
        onChange={onChangeTitle}
        onBlur={onBlurTitle}
        value={title}
      />
      <div className="flex flex-col w-1/2 border-gkd-sakura-text border-2">
        {contents &&
          contents.map((content, index) => {
            return (
              <div
                className="DIV_CONTENT w-full selection:bg-gkd-sakura-text"
                key={`contentsDiv:${index}`}
                ref={el => (divRefs.current[index] = el)}>
                {DocumentGContent(index)}
              </div>
            )
          })}
        <div
          className="DIV_CONTENT w-full selection:bg-gkd-sakura-bg"
          key={`contentsDiv:${contentsLen}`}
          ref={el => (divRefs.current[contentsLen] = el)}>
          {DocumentGContent(contentsLen)}
        </div>
      </div>
      <Button onClick={onClickTest}>yes</Button>
    </div>
  )
}
