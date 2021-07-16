import { Board } from './Board'
import { operate } from './operate'

const board = new Board()

/**
 *
 * @param {HTMLElement} el
 */
function startGame(el, up, cityData) {
    board.init(el)
    board.drawBoard(up, cityData)

    operate.start(el, board.raycaster)
    // board.changeMode(constant.OPER_MODE)
}

export { board, startGame }
