let body = document.querySelector('body')

function createOverlay() {
    let overlay = document.createElement('div');
    overlay.setAttribute('class', 'overlay');

    return overlay
}

export default function createPopup() {
    let popup = document.createElement('div')
    popup.classList.add("popup")
    body.appendChild(createOverlay())
    body.appendChild(popup)

}