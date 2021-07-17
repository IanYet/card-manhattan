import { Board } from './Board'
import { operate } from './operate'
import { constant } from './status'

const board = new Board()

/**
 *
 * @param {HTMLElement} el
 */
function startGame(el, up, cityData) {
    board.init(el)
    board.drawBoard(up, cityData)

    operate.start(el, board.raycaster)
    Board.changeMode(constant.OPER_MODE)
}

export { board, startGame }
