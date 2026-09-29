# Plan de pruebas: Carrito y Checkout — saucedemo.com

Sitio: https://www.saucedemo.com
Usuario de prueba: `standard_user` / `secret_sauce` (login previo asumido como precondición común)

Relevamiento realizado con `playwright-cli` (modo `--headed`), navegando manualmente cada escenario e inspeccionando snapshots/selectores (`[data-test="..."]`) antes de documentar.

---

## 1. Carrito de compras

### 1.1 Agregar uno o más productos al carrito y verificar el contador del ícono del carrito

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Usuario en `/inventory.html`.
- Carrito vacío (ícono muestra "Cart, empty", sin badge numérico).

**Pasos**
1. Hacer clic en "Add to cart" del producto "Sauce Labs Backpack".
2. Verificar el ícono del carrito.
3. Hacer clic en "Add to cart" del producto "Sauce Labs Bike Light".
4. Verificar nuevamente el ícono del carrito.

**Aserciones esperadas**
- Tras el paso 1: el botón cambia de "Add to cart" a "Remove" para ese producto; el ícono del carrito (`[data-test="shopping-cart-link"]`) pasa de "Cart, empty" a "Cart, 1 items" y muestra el badge `"1"`.
- Tras el paso 3: el badge del carrito muestra `"2"` y el ícono se describe como "Cart, 2 items".
- El estado de cada producto agregado persiste (botón "Remove" visible) mientras se navega dentro de `/inventory.html`.

---

### 1.2 Remover un producto desde el catálogo (`/inventory.html`)

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Carrito con al menos 2 productos agregados (ver 1.1), badge en `"2"`.

**Pasos**
1. En `/inventory.html`, hacer clic en "Remove" del producto "Sauce Labs Backpack" (el mismo botón que antes decía "Add to cart").
2. Verificar el ícono del carrito y el estado del botón del producto removido.

**Aserciones esperadas**
- El badge del carrito decrece de `"2"` a `"1"` (ícono pasa a "Cart, 1 items").
- El botón del producto removido vuelve a mostrar "Add to cart".
- El resto de los productos agregados (ej. "Sauce Labs Bike Light") no se ven afectados y mantienen su botón "Remove".

---

### 1.3 Remover un producto desde la vista del carrito (`/cart.html`)

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Carrito con 1 producto agregado (ej. "Sauce Labs Bike Light" tras el escenario 1.2), badge en `"1"`.

**Pasos**
1. Hacer clic en el ícono del carrito para navegar a `/cart.html`.
2. Verificar que el producto aparece listado con cantidad (`QTY = 1`), nombre, descripción, precio y botón "Remove".
3. Hacer clic en "Remove" del producto listado.
4. Verificar el ícono del carrito y el listado de la página.

**Aserciones esperadas**
- Tras el paso 1: URL es `/cart.html`; se muestra la sección "Your Cart" con el producto correcto.
- Tras el paso 3: el producto desaparece de la tabla del carrito.
- El ícono del carrito pasa a "Cart, empty" (sin badge numérico).
- Los botones "Continue Shopping" y "Checkout" permanecen visibles y habilitados aun con el carrito vacío.

---

## 2. Checkout

### 2.1 Proceso de checkout exitoso (datos válidos, resumen y confirmación)

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Al menos 1 producto en el carrito (ej. "Sauce Labs Backpack").
- Usuario en `/cart.html`.

**Pasos**
1. Hacer clic en "Checkout" → navega a `/checkout-step-one.html`.
2. Completar "First Name" con un valor genérico (ej. `Juan`).
3. Completar "Last Name" con un valor genérico (ej. `Perez`).
4. Completar "Zip/Postal Code" con un valor genérico (ej. `1000`).
5. Hacer clic en "Continue" → navega a `/checkout-step-two.html`.
6. Verificar el resumen: producto(s), cantidad, precio, "Payment Information" (SauceCard #31337), "Shipping Information" (Free Pony Express Delivery), "Item total", "Tax" y "Total".
7. Hacer clic en "Finish" → navega a `/checkout-complete.html`.

**Aserciones esperadas**
- Tras el paso 5: la URL es `/checkout-step-one.html` → `/checkout-step-two.html`, sin mensajes de error.
- El resumen (`checkout-step-two.html`) muestra correctamente el/los producto(s) agregados, con "Item total" igual a la suma de precios, "Tax" calculado y "Total" = Item total + Tax.
- Tras el paso 7: la URL es `/checkout-complete.html`; se muestra el encabezado "Thank you for your order!", el texto de despacho ("Your order has been dispatched...") y el botón "Back Home".
- El ícono del carrito se resetea a "Cart, empty" tras finalizar la compra.

---

### 2.2 Validaciones de formulario de checkout: campos obligatorios vacíos

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Al menos 1 producto en el carrito.
- Usuario en `/checkout-step-one.html` (vía "Checkout" desde `/cart.html`).

#### 2.2.1 Continuar sin completar "First Name"

**Pasos**
1. Dejar todos los campos vacíos.
2. Hacer clic en "Continue".

**Aserciones esperadas**
- La navegación NO avanza; la URL permanece en `/checkout-step-one.html`.
- Se muestra un mensaje de error: `Error: First Name is required`.

#### 2.2.2 Continuar sin completar "Last Name"

**Pasos**
1. Completar "First Name" (ej. `Juan`), dejar "Last Name" y "Zip/Postal Code" vacíos.
2. Hacer clic en "Continue".

**Aserciones esperadas**
- La navegación NO avanza; URL permanece en `/checkout-step-one.html`.
- Se muestra el mensaje de error: `Error: Last Name is required`.

#### 2.2.3 Continuar sin completar "Zip/Postal Code"

**Pasos**
1. Completar "First Name" (ej. `Juan`) y "Last Name" (ej. `Perez`), dejar "Zip/Postal Code" vacío.
2. Hacer clic en "Continue".

**Aserciones esperadas**
- La navegación NO avanza; URL permanece en `/checkout-step-one.html`.
- Se muestra el mensaje de error: `Error: Postal Code is required`.
- Al completar el campo faltante y volver a hacer clic en "Continue", el usuario avanza correctamente a `/checkout-step-two.html` sin errores.

---

### 2.3 Cancelación del proceso de compra

#### 2.3.1 Cancelación desde la pantalla de información (`/checkout-step-one.html`)

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Al menos 1 producto en el carrito.
- Usuario en `/checkout-step-one.html`.

**Pasos**
1. (Opcional) Completar parcial o totalmente el formulario.
2. Hacer clic en "Cancel".

**Aserciones esperadas**
- El usuario regresa a `/cart.html` (no a `/inventory.html`).
- El producto agregado previamente sigue presente en el carrito (no se pierde la selección).
- El badge del carrito conserva su valor previo (ej. `"1"`).

#### 2.3.2 Cancelación desde la pantalla de confirmación (`/checkout-step-two.html`)

**Condiciones previas**
- Sesión iniciada con `standard_user`.
- Al menos 1 producto en el carrito.
- Usuario completó el formulario de información válidamente y se encuentra en `/checkout-step-two.html` (resumen).

**Pasos**
1. Hacer clic en "Cancel".

**Aserciones esperadas**
- El usuario regresa a `/inventory.html` (comportamiento distinto al cancelar desde `/checkout-step-one.html`, que regresa a `/cart.html`).
- El producto agregado previamente sigue presente en el carrito (badge del carrito conserva su valor, ej. `"1"`).
- No se completa la compra: no se navega a `/checkout-complete.html` y no se muestra el mensaje de confirmación.

---

## Notas generales relevadas durante la exploración

- Los selectores del sitio usan atributos estables `data-test` (ej. `[data-test="firstName"]`, `[data-test="add-to-cart-sauce-labs-backpack"]`, `[data-test="checkout"]`, `[data-test="finish"]`), recomendables como base de localizadores para la futura implementación de tests.
- El botón "Add to cart"/"Remove" es el mismo elemento que cambia de estado (no aparecen elementos duplicados).
- El botón "Checkout" en `/cart.html` permanece visible y clickeable incluso con el carrito vacío (comportamiento a validar si se agrega un escenario de checkout con carrito vacío, fuera del alcance de este plan).
- Cancelar desde `/checkout-step-one.html` y desde `/checkout-step-two.html` llevan a destinos distintos (`/cart.html` vs `/inventory.html` respectivamente) — importante para no asumir un único comportamiento de "Cancel" en toda la suite.
