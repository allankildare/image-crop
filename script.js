const photoFile = document.getElementById('photo-file')
let image = document.getElementById('photo-preview')

// selecao e pre-visualizacao
document.getElementById('select-image')
.addEventListener('click', () => {
    photoFile.click()
})

// funcionalidade que funcionara quando a DOM estiver carregada
window.addEventListener('DOMContentLoaded', () => {
    
    photoFile.addEventListener('change', () => {
        // capturando apenas um arquivo
        let file = photoFile.files.item(0)
        // leitura de arquivo
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(event) {
            
            image.src = event.target.result
        }
    })
})

// ferramenta de selecao
const selection = document.getElementById('selection-tool')

let startX, startY, relativeStartX, relativeStartY,
    endX, endY, relativeEndX, relativeEndY

let startSelection = false

const events = {
    mouseover(){
        this.style.cursor = 'crosshair'
    },
    mousedown(){
        const {clientX, clientY, offsetX, offsetY} = event
        
        /*console.table({
            'client': [clientX, clientY],
            'offset': [offsetX, offsetY]
        })*/

        startX = clientX
        startY = clientY
        relativeStartX = offsetX
        relativeStartY = offsetY
        startSelection = true
    },
    mousemove(){
        endX = event.clientX
        endY = event.clientY

        if(startSelection) {
            selection.style.display = 'initial'

            selection.style.top = `${startY}px`
            selection.style.left = `${startX}px`

            selection.style.width = `${endX-startX}px`
            selection.style.height = `${endY-startY}px`
        }
        
    },
    mouseup(){
        startSelection = false

        relativeEndX = event.layerX
        relativeEndY = event.layerY
    }
}

Object.keys(events)
    .forEach(eventName => {
        image.addEventListener(eventName, events[eventName])
    })