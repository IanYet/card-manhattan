import { Board } from './Board'
import { operate } from './operate'
import { constant } from './status'

/**
 *
 * @param {HTMLElement} el
 */
async function startGame(el) {
    const board = new Board(el)
    await board.drawBoard()

    operate.start(el, board.raycaster)
    board.changeMode(constant.OPER_MODE)
}

export { startGame }
