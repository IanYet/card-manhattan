import './index.css'
import { main } from './src/app'
import { net } from './src/net'

net.setUrl('./')
net.setKey('123')
main()

const title = document.createElement('h1')
title.innerText = 'Manhattan'

const title2 = document.createElement('h3')
title2.innerText = 'build your dream city'

const title3 = document.createElement('h3')
title3.innerText = 'Cooming Soon...'

const style = {
    position: 'fixed',
    width: '100vw',
    textAlign: 'center',
    zIndex: 10,
    color: 'white'
}

title.style.position = style.position
title.style.width = style.width
title.style.textAlign = style.textAlign
title.style.zIndex = style.zIndex
title.style.top = '5rem'
title.style.color = style.color

title2.style.position = style.position
title2.style.width = style.width
title2.style.textAlign = style.textAlign
title2.style.zIndex = style.zIndex
title2.style.top = '10rem'
title2.style.color = style.color

title3.style.position = style.position
title3.style.width = style.width
title3.style.textAlign = style.textAlign
title3.style.zIndex = style.zIndex
title3.style.bottom = '5rem'
title3.style.color = style.color

document.body.append(title, title2, title3)
