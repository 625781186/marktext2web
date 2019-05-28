/**
 * translate markdown format to content state used by editor
 */
import Markdownit from 'markdown-it'
import parse5 from 'parse5'
// To be disabled rules when parse markdown, Becase content state don't need to parse inline rules
import { INLINE_RULES } from '../config'

const md = new Markdownit()
md.disable(INLINE_RULES)

const importRegistor = ContentState => {
  ContentState.prototype.importMarkdown = function (text) {
    this.keys = new Set()
    this.codeBlocks = new Map()
    // mock a root block...
    const rootState = {
      key: null,
      type: 'root',
      text: '',
      parent: null,
      preSibling: null,
      nextSibling: null,
      children: []
    }

    const htmlText = md.render(text)
    const domAst = parse5.parseFragment(htmlText)

    const childNodes = domAst.childNodes

    const getLang = node => {
      let lang = ''
      if (node.nodeName === 'code') {
        const classAttr = node.attrs.filter(attr => attr.name === 'class')[0]
        if (classAttr && /^language/.test(classAttr.value)) {
          lang = classAttr.value.split('-')[1]
        }
      }
      return lang
    }

    const travel = (parent, childNodes) => {
      const len = childNodes.length
      let i

      for (i = 0; i < len; i++) {
        const child = childNodes[i]
        let block
        let value
        switch (child.nodeName) {
          case 'p':
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            const textValue = child.childNodes[0].value
            const match = /\d/.exec(child.nodeName)
            value = match ? '#'.repeat(+match[0]) + textValue : textValue
            block = this.createBlock(child.nodeName, value)
            this.appendChild(parent, block)
            break

          case 'li':
            block = this.createBlock('li')
            this.appendChild(parent, block)
            if (child.childNodes.length === 1) {
              value = child.childNodes[0].value
              const pBlock = this.createBlock('p', value)
              this.appendChild(block, pBlock)
            } else {
              travel(block, child.childNodes)
            }
            break

          case 'ul':
            block = this.createBlock('ul')
            travel(block, child.childNodes)
            this.appendChild(parent, block)
            break

          case 'ol':
            block = this.createBlock('ol')
            child.attrs.forEach(attr => {
              block[attr.name] = attr.value
            })
            if (!block.start) {
              block.start = 1
            }
            travel(block, child.childNodes)
            this.appendChild(parent, block)
            break

          case 'blockquote':
            block = this.createBlock('blockquote')
            travel(block, child.childNodes)
            this.appendChild(parent, block)
            break

          case 'pre':
            const codeNode = child.childNodes[0]
            value = codeNode.childNodes[0].value

            if (value.endsWith('\n')) {
              value = value.replace(/\n+$/, '')
            }
            block = this.createBlock('pre', value)
            block.lang = getLang(codeNode)
            this.appendChild(parent, block)
            break
          default:
            if (child.tagName) {
              throw new Error(`unhandle node type ${child.tagName}`)
            }
            break
        }
      }
    }

    travel(rootState, childNodes)
    this.blocks = rootState.children
    const lastBlock = this.getLastBlock()
    this.cursor = {
      key: lastBlock.key,
      range: {
        start: lastBlock.text.length,
        end: lastBlock.text.length
      }
    }
    this.render()
  }
}

export default importRegistor
