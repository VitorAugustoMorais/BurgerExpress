const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')
const withoutOrder = document.getElementById('without-order')


let cart = []

// ABRIR MODAL DO CARRINHO
cartBtn.addEventListener('click', function () {
    updateCartModal()
    cartModal.style.display = 'flex'
})

// FECHAR O MODAL QUANBDO CLICAR FORA
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal)
        cartModal.style.display = 'none'

})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none'
})

menu.addEventListener('click', function (event) {
    // console.log(event.target)
    let parentButton = event.target.closest('.add-to-card-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price)
    }

})


// FUNÇÃO PARA ADICIONR NO CARRINHO
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    withoutOrder.classList.add('hidden')


    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//ATUALIZA CARRINHO
function updateCartModal() {
    cartItemsContainer.innerHTML = ''
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement('div')
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium" >${item.name}</p>
                <p>Qnt: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
        `
        total += item.price * item.quantity
        cartItemsContainer.appendChild(cartItemElement)
    });

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    cartCounter.innerText = cart.length
}




//FUNÇÃO REMOVER DO CARRINHO
cartItemsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const name = event.target.getAttribute('data-name')
        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name)

    if (index !== -1) {
        const item = cart[index]

        if (item.quantity > 1) {
            item.quantity -= 1
            updateCartModal()
            return;
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}


addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value

    if (inputValue !== '') {
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }
})


//FINALIZAR PEDIDO
checkoutBtn.addEventListener('click', function () {
    const isOpen = checkRestaurentOpen()
    if (!isOpen) {
        Toastify({
            text: "Ops, o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
          }).showToast();
        return
    }
    if (cart.length === 0) {
        withoutOrder.classList.remove('hidden')
        return
    }
    if (addressInput.value === '') {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return
    }

    //ENVIAR PEDIDO PARA API DO WHATS   
    const cartItems = cart.map((item) => {
        return (`${item.quantity} - ${item.name} | Preço: R$ ${item.price.toFixed(2)}\n`).replace('.', ',')
    }).join("")

    const createMessage = `*MEU PEDIDO:*\n${cartItems}\n*Endereço:* ${addressInput.value}`
    const message = encodeURIComponent(createMessage)
    const phone = "945298541"
    // const phone = "978731865"

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

    cart = []
    updateCartModal()
})


// VERIFICAR A DATA E MANIPULAR CARD HORARIO
function checkRestaurentOpen() {
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const spanItem = document.getElementById('date-span')
const isOpen = checkRestaurentOpen()


if (isOpen) {
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
} else {
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}  