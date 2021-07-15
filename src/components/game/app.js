import style from './app.module.css'
import { Board } from './Board'
import { operate } from './operate'
import { constant } from './status'

async function main() {
    const app = document.getElementById('app')
    app.className = style.app

    const board = new Board(app)
    await board.drawBoard()

    operate.start(app, board.raycaster)
    board.changeMode(constant.OPER_MODE)
}

export { main }
