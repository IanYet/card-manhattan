import style from './app.module.css'
import { Board } from './Board'

async function main() {
    const app = document.getElementById('app')
    app.className = style.app

    const board = new Board(app)
    await board.drawBoard()
}

export { main }
