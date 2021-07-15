import { Board } from './Board'
import { operate } from './operate'

const board = new Board()

/**
 *
 * @param {HTMLElement} el
 */
async function startGame(el) {
    board.init(el)
    await board.drawBoard()

    operate.start(el, board.raycaster)
    // board.changeMode(constant.OPER_MODE)
}

export { board, startGame }
