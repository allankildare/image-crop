const photoFile = document.getElementById('photo-file')
let photoPreview = document.getElementById('photo-preview')
let image
let photoName

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
        photoName = file.name
        // leitura de arquivo
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(event) {
            image = new Image()
            image.src = event.target.result
            image.onload = onLoadImage
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

        // mostra o botao de corte
        cropButton.style.display = 'initial'
    }
}

Object.keys(events)
    .forEach(eventName => {
        photoPreview.addEventListener(eventName, events[eventName])
    })

// Canvas
let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

function onLoadImage() {
    const {width, height} = image
    canvas.width = width
    canvas.height = height

    // limpar o contexto
    ctx.clearRect(0, 0, width, height)

    // desenhar a imagem no contexto
    ctx.drawImage(image, 0, 0) // eixoX: 0, eixoY: 0
    
    photoPreview.src = canvas.toDataURL()
}

// cortar imagem
const cropButton = document.getElementById('crop-image')
cropButton.onclick = () => {
    const {width:imgW, height: imgH} = image
    const {width: previewW, height: previewH} = photoPreview

    const [widthFactor, heightFactor] = [
        +(imgW / previewW), +(imgH / previewH)
    ]

    const [selectionWidth, selectionHeight] = [
        +selection.style.width.replace('px', ''),
        +selection.style.height.replace('px', '')
    ]

    const [croppedWidth, croppedHeight] = [
        +(selectionWidth * widthFactor),
        +(selectionHeight * heightFactor)
    ]

    const [actualX, actualY] = [
        +(relativeStartX * widthFactor),
        +(relativeStartY * heightFactor)
    ]

    // pegar do contexto a imagem cortada
    const croppedImage = ctx.getImageData(actualX, actualY, croppedWidth, croppedHeight)

    // limpar o contexto
    ctx.clearRect(0, 0, ctx.width, ctx.height)

    //ajuste de proporções
    image.width = canvas.width = croppedWidth
    image.height = canvas.height = croppedHeight

    // adicionar imagem cortada ao contexto
    ctx.putImageData(croppedImage, 0, 0)

    // esconder a ferramenta de selecao
    selection.style.display = 'none'

    // atualizar o preview da imagem 
    photoPreview.src = canvas.toDataURL()

    // mostrar botao de download
    downloadButton.style.display = 'initial'

}

// Download
const downloadButton = document.getElementById('download')
downloadButton.addEventListener('click', () => {
    const a = document.createElement('a')
    a.download = `${photoName}-corte.png`
    a.href = canvas.toDataURL()
    a.click()
})