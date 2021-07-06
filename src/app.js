import style from './app.module.css'
import { Board } from './board'

function main() {
    const app = document.getElementById('app')
    app.className = style.app

    const board = new Board(app)
}

export default main
