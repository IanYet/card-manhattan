function ui() {
    title()
    btns()
}

function title() {
    const titleContainer = document.createElement('div')
    const title = document.createElement('div')
    const subTitle = document.createElement('div')
    titleContainer.append(title, subTitle)

    title.innerText = 'Manhattan'
    subTitle.innerText = 'build you dream city'
    document.body.append(titleContainer)

    titleContainer.style.color = '#ffffff'
    titleContainer.style.zIndex = 100
    titleContainer.style.position = 'fixed'
    titleContainer.style.top = '10vh'
    titleContainer.style.width = '100vw'
    titleContainer.style.textAlign = 'center'
    titleContainer.style.userSelect = 'none'

    title.style.fontSize = '3rem'
    title.style.marginBottom = '1rem'
    subTitle.style.fontSize = '1rem'
    subTitle.style.fontWeight = 'bold'
}

function btns() {
    const footer = document.createElement('div')
    footer.className = 'footer'
    const btnContainer = document.createElement('div')
    btnContainer.className = 'btnContainer'
    footer.append(btnContainer)

    const createBtn = document.createElement('div')
    createBtn.className = 'btn createBtn'
    createBtn.innerText = '创建房间'
    const joinBtn = document.createElement('div')
    joinBtn.className = 'btn joinBtn'
    joinBtn.innerText = '加入房间'
    btnContainer.append(createBtn, joinBtn)

    const knowLink = document.createElement('div')
    knowLink.className = 'link'
    knowLink.innerText = '了解规则'
    footer.append(knowLink)

    document.body.append(footer)
}

export { ui }
