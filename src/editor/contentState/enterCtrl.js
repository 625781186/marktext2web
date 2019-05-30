import selection from '../selection'

const enterCtrl = ContentState => {
  ContentState.prototype.chopBlock = function (block) {
    const parent = this.getParent(block)
    const type = parent.type
    const container = this.createBlock(type)
    const index = this.findIndex(parent.children, block)
    const partChildren = parent.children.splice(index + 1)
    block.nextSibling = null
    partChildren.forEach(b => {
      this.appendChild(container, b)
    })
    this.insertAfter(container, parent)
  }

  ContentState.prototype.createRow = function (row) {
    const trBlock = this.createBlock('tr')
    const len = row.children.length
    let i
    for (i = 0; i < len; i++) {
      const tdBlock = this.createBlock('td')
      const preChild = row.children[i]
      tdBlock.column = i
      tdBlock.align = preChild.align
      this.appendChild(trBlock, tdBlock)
    }
    return trBlock
  }

  ContentState.prototype.createBlockLi = function (text = '', type = 'p') {
    const liBlock = this.createBlock('li')
    const pBlock = this.createBlock(type, text)
    this.appendChild(liBlock, pBlock)
    return liBlock
  }

  ContentState.prototype.createTaskItemBlock = function (text = '', checked = false) {
    const listItem = this.createBlock('li')
    const paragraphInListItem = this.createBlock('p', text)
    const checkboxInListItem = this.createBlock('input')

    listItem.listItemType = 'task'
    checkboxInListItem.checked = checked
    this.appendChild(listItem, checkboxInListItem)
    this.appendChild(listItem, paragraphInListItem)
    return listItem
  }

  ContentState.prototype.enterHandler = function (event) {
    const { start, end } = selection.getCursorRange()

    if (start.key !== end.key) {
      event.preventDefault()
      const startBlock = this.getBlock(start.key)
      const endBlock = this.getBlock(end.key)
      const key = start.key
      const offset = start.offset

      const startRemainText = startBlock.type === 'pre'
        ? startBlock.text.substring(0, start.offset - 1)
        : startBlock.text.substring(0, start.offset)

      const endRemainText = endBlock.type === 'pre'
        ? endBlock.text.substring(end.offset - 1)
        : endBlock.text.substring(end.offset)

      startBlock.text = startRemainText + endRemainText

      this.removeBlocks(startBlock, endBlock)
      this.cursor = {
        start: { key, offset },
        end: { key, offset }
      }
      this.render()
      return this.enterHandler(event)
    }

    if (start.key === end.key && start.offset !== end.offset) {
      event.preventDefault()
      const key = start.key
      const offset = start.offset
      const block = this.getBlock(key)
      block.text = block.text.substring(0, start.offset) + block.text.substring(end.offset)
      this.cursor = {
        start: { key, offset },
        end: { key, offset }
      }
      this.render()
      return this.enterHandler(event)
    }

    let paragraph = document.querySelector(`#${start.key}`)
    let block = this.getBlock(start.key)
    let parent = this.getParent(block)
    // handle float box
    const { list, index, show } = this.floatBox
    const { floatBox } = this
    if (show) {
      event.preventDefault()
      floatBox.cb(list[index])
      const isUpdated = this.codeBlockUpdate(block)
      isUpdated && this.render()
      return
    }
    // handle cursor in code block
    if (block.type === 'pre') {
      return
    }
    event.preventDefault()

    const getNextBlock = row => {
      let nextSibling = this.getBlock(row.nextSibling)
      if (!nextSibling) {
        const rowContainer = this.getBlock(row.parent)
        const table = this.getBlock(rowContainer.parent)
        const figure = this.getBlock(table.parent)
        if (rowContainer.type === 'thead') {
          nextSibling = table.children[1]
        } else if (figure.nextSibling) {
          nextSibling = this.getBlock(figure.nextSibling)
        } else {
          nextSibling = this.createBlock('p')
          this.insertAfter(nextSibling, figure)
        }
      }
      return this.firstInDescendant(nextSibling)
    }

    if (/th|td/.test(block.type)) {
      const row = this.getBlock(block.parent)
      const rowContainer = this.getBlock(row.parent)
      const table = this.getBlock(rowContainer.parent)

      if (event.metaKey) {
        const nextRow = this.createRow(row)
        if (rowContainer.type === 'thead') {
          const tBody = this.getBlock(rowContainer.nextSibling)
          this.insertBefore(nextRow, tBody.children[0])
        } else {
          this.insertAfter(nextRow, row)
        }
        table.row++
      }

      const nextSibling = getNextBlock(row)
      const key = nextSibling.key
      const offset = 0

      this.cursor = {
        start: { key, offset },
        end: { key, offset }
      }
      return this.render()
    }
    if (
      (parent && parent.type === 'li' && this.isOnlyChild(block)) ||
      (parent && parent.type === 'li' && parent.listItemType === 'task' && parent.children.length === 2) // one `input` and one `p`
    ) {
      block = parent
      parent = this.getParent(block)
    }
    const { left, right } = selection.getCaretOffsets(paragraph)
    const preType = block.type

    let type
    let newBlock

    switch (true) {
      case left !== 0 && right !== 0: // cursor in the middle
        type = preType
        let { pre, post } = selection.chopHtmlByCursor(paragraph)

        if (/^h\d/.test(type)) {
          const PREFIX = /^#+/.exec(pre)[0]
          post = `${PREFIX}${post}`
        }

        if (type === 'li') {
          // handle task item
          if (block.listItemType === 'task') {
            const { checked } = block.children[0] // block.children[0] is input[type=checkbox]
            block.children[1].text = pre // block.children[1] is p
            newBlock = this.createTaskItemBlock(post, checked)
          } else {
            block.children[0].text = pre
            newBlock = this.createBlockLi(post)
            newBlock.listItemType = block.listItemType
          }
        } else {
          block.text = pre
          newBlock = this.createBlock(type, post)
        }
        this.insertAfter(newBlock, block)
        break
      case left === 0 && right === 0: // paragraph is empty
        if (parent && (parent.type === 'blockquote' || parent.type === 'ul')) {
          newBlock = this.createBlock('p')

          if (this.isOnlyChild(block)) {
            this.insertAfter(newBlock, parent)
            this.removeBlock(parent)
          } else if (this.isFirstChild(block)) {
            this.insertBefore(newBlock, parent)
          } else if (this.isLastChild(block)) {
            this.insertAfter(newBlock, parent)
          } else {
            this.chopBlock(block)
            this.insertAfter(newBlock, parent)
          }

          this.removeBlock(block)
        } else if (parent && parent.type === 'li') {
          if (parent.listItemType === 'task') {
            const { checked } = parent.children[0]
            newBlock = this.createTaskItemBlock('', checked)
          } else {
            newBlock = this.createBlockLi()
            newBlock.listItemType = parent.listItemType
          }
          this.insertAfter(newBlock, parent)
          const index = this.findIndex(parent.children, block)
          const partChildren = parent.children.splice(index + 1)
          partChildren.forEach(b => this.appendChild(newBlock, b))

          this.removeBlock(block)
        } else {
          newBlock = this.createBlock('p')
          if (preType === 'li') {
            const parent = this.getParent(block)
            this.insertAfter(newBlock, parent)
            this.removeBlock(block)
          } else {
            this.insertAfter(newBlock, block)
          }
        }
        break
      case left !== 0 && right === 0: // cursor at end of paragraph
      case left === 0 && right !== 0: // cursor at begin of paragraph
        if (preType === 'li') {
          if (block.listItemType === 'task') {
            const { checked } = block.children[0]
            newBlock = this.createTaskItemBlock('', checked)
          } else {
            newBlock = this.createBlockLi()
            newBlock.listItemType = block.listItemType
          }
        } else {
          newBlock = this.createBlock('p')
        }

        if (left === 0 && right !== 0) {
          this.insertBefore(newBlock, block)
          newBlock = block
        } else {
          this.insertAfter(newBlock, block)
        }
        break
      default:
        newBlock = this.createBlock('p')
        this.insertAfter(newBlock, block)
        break
    }

    this.codeBlockUpdate(newBlock.type === 'li' ? newBlock.children[0] : newBlock)
    // If block is pre block when updated, need to focus it.
    const blockNeedFocus = this.codeBlockUpdate(block.type === 'li' ? block.children[0] : block)
    let tableNeedFocus = false
    let cursorBlock
    if (!blockNeedFocus) {
      tableNeedFocus = this.tableBlockUpdate(block.type === 'li' ? block.children[0] : block)
    }

    if (blockNeedFocus) {
      cursorBlock = block
    } else if (tableNeedFocus) {
      cursorBlock = tableNeedFocus
    } else {
      cursorBlock = newBlock
    }

    let key
    if (cursorBlock.type === 'li') {
      if (cursorBlock.listItemType === 'task') {
        key = cursorBlock.children[1].key
      } else {
        key = cursorBlock.children[0].key
      }
    } else {
      key = cursorBlock.key
    }

    const offset = 0
    this.cursor = {
      start: { key, offset },
      end: { key, offset }
    }
    this.render()
  }
}

export default enterCtrl
