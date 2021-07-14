import style from './app.module.css'
import { Board } from './Board'
import { operate } from './operate'

async function main() {
    const app = document.getElementById('app')
    app.className = style.app

    const board = new Board(app)
    await board.drawBoard()

    operate.start(app, board.raycaster)
}

export { main }
