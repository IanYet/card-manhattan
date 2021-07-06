import style from './app.module.css'
import logo from '../assets/logo.svg'

function main() {
    const app = document.getElementById('app')
    app.className = style.app

    const img = document.createElement('img')
    img.src = logo
    img.className = style.logo

    const tips = document.createElement('p')
    tips.innerHTML = 'Edit <code>src/app.js</code> and save to reload.'
    tips.className = style.tips

    const link = document.createElement('a')
    link.href = 'https://webpack.js.org/'
    link.innerText = 'Learn webpack'
    link.className = style.link


    app.appendChild(img)
    app.appendChild(tips)
    app.appendChild(link)
}

export default main
