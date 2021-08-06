let body = document.querySelector('body')

export default function createPopup() {
    let popup = document.createElement('div')
    popup.classList.add("popup")
    body.appendChild(popup)

}