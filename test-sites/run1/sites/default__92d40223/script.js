
// Generated JS

const UNIT_PRICE = 19.99;
const SHIPPING_COST = 5.00;

function getStoredOrUrlQuantity() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlQty = parseInt(urlParams.get('quantity'), 10);
    if (!isNaN(urlQty) && urlQty >= 1) {
        const clamped = Math.min(99, urlQty);
        sessionStorage.setItem('quantity', String(clamped));
        return clamped;
    }
    const storedQty = parseInt(sessionStorage.getItem('quantity'), 10);
    if (!isNaN(storedQty) && storedQty >= 1) {
        return Math.min(99, storedQty);
    }
    return 1;
}

function applyQuantityToPage(qty) {
    const validQty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    sessionStorage.setItem('quantity', String(validQty));

    const subtotal = (UNIT_PRICE * validQty).toFixed(2);
    const total = (UNIT_PRICE * validQty + SHIPPING_COST).toFixed(2);
    const itemWord = validQty === 1 ? 'item' : 'items';
    const itemWordCap = validQty === 1 ? 'Item' : 'Items';

    // Product page quantity selector
    const productQtySelect = document.getElementById('quantity');
    if (productQtySelect) {
        productQtySelect.value = String(validQty);
    }

    // Cart page elements
    const cartQtyInput = document.getElementById('cart-quantity');
    if (cartQtyInput && document.activeElement !== cartQtyInput) {
        cartQtyInput.value = String(validQty);
    } else if (cartQtyInput && cartQtyInput.value !== String(validQty)) {
        cartQtyInput.value = String(validQty);
    }

    const checkoutQtyInput = document.getElementById('checkout-quantity-input');
    if (checkoutQtyInput) {
        checkoutQtyInput.value = String(validQty);
    }

    const cartStatusPillText = document.getElementById('cart-status-pill-text');
    if (cartStatusPillText) {
        cartStatusPillText.textContent = `🛒 Cart (${validQty} ${itemWord})`;
    }

    const cartItemCount = document.getElementById('cart-item-count');
    if (cartItemCount) {
        cartItemCount.textContent = `${validQty} ${itemWordCap} Selected`;
    }

    const cartItemSubtotal = document.getElementById('cart-item-subtotal');
    if (cartItemSubtotal) {
        cartItemSubtotal.textContent = `$${subtotal}`;
    }

    const summarySubtotalLabel = document.getElementById('summary-subtotal-label');
    if (summarySubtotalLabel) {
        summarySubtotalLabel.textContent = `Subtotal (${validQty} ${itemWord})`;
    }

    const summarySubtotalAmount = document.getElementById('summary-subtotal-amount');
    if (summarySubtotalAmount) {
        summarySubtotalAmount.textContent = `$${subtotal}`;
    }

    const summaryTotalAmount = document.getElementById('summary-total-amount');
    if (summaryTotalAmount) {
        summaryTotalAmount.textContent = `$${total}`;
    }

    // Checkout review step elements
    document.querySelectorAll('.review-qty-val').forEach(el => {
        el.textContent = String(validQty);
    });
    document.querySelectorAll('.review-qty-label').forEach(el => {
        el.textContent = `${validQty} ${itemWord}`;
    });
    document.querySelectorAll('.review-item-price-val, .review-subtotal-val').forEach(el => {
        el.textContent = `$${subtotal}`;
    });
    document.querySelectorAll('.review-total-val').forEach(el => {
        el.textContent = `$${total}`;
    });

    // Order confirmation page elements
    const confItemQty = document.getElementById('conf-item-qty');
    if (confItemQty) {
        confItemQty.textContent = String(validQty);
    }
    const confTotalPrice = document.getElementById('conf-total-price');
    if (confTotalPrice) {
        confTotalPrice.textContent = `$${total}`;
    }
    const confPriceBreakdown = document.getElementById('conf-price-breakdown');
    if (confPriceBreakdown) {
        confPriceBreakdown.textContent = `($${subtotal} + $${SHIPPING_COST.toFixed(2)} shipping)`;
    }
}

function setCartQuantity(newQty) {
    const clamped = Math.max(1, Math.min(99, parseInt(newQty, 10) || 1));
    applyQuantityToPage(clamped);

    if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('quantity', String(clamped));
        window.history.replaceState({}, '', url.toString());
    }
}

function changeCartQuantity(delta) {
    const current = getStoredOrUrlQuantity();
    setCartQuantity(current + delta);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize quantity across all pages
    const initialQty = getStoredOrUrlQuantity();
    applyQuantityToPage(initialQty);

    const cartQtyInput = document.getElementById('cart-quantity');
    if (cartQtyInput) {
        cartQtyInput.addEventListener('input', function() {
            if (this.value !== '') {
                setCartQuantity(this.value);
            }
        });
        cartQtyInput.addEventListener('change', function() {
            setCartQuantity(this.value);
        });
    }

    // Initialize Accordion: Open the first item if none are active
    const firstAccordion = document.querySelector('.accordion-item');
    if (firstAccordion) {
        firstAccordion.classList.add('active');
    }

    // Billing Address Toggle
    const billingCheckbox = document.getElementById('billing-same-as-shipping');
    const billingFields = document.getElementById('billing-fields');

    function toggleBilling() {
        if (!billingCheckbox || !billingFields) return;

        const inputs = billingFields.querySelectorAll('input, select, textarea');

        if (billingCheckbox.checked) {
            billingFields.style.display = 'none';
            inputs.forEach(input => input.disabled = true);
        } else {
            billingFields.style.display = 'block';
            inputs.forEach(input => input.disabled = false);
        }
    }

    if (billingCheckbox && billingFields) {
        // Set initial state
        toggleBilling();

        billingCheckbox.addEventListener('change', toggleBilling);
    }

    // Guest Checkout
    // In the multi-page flow the control is a plain link to the next page. In
    // the single-page flow it points at a section of this page, which an
    // accordion or a tab layout keeps hidden until it is opened.
    const guestControl = document.getElementById('continue-as-guest');
    if (guestControl) {
        guestControl.addEventListener('click', function() {
            const target = guestControl.getAttribute('href') || '';
            if (!target.startsWith('#')) return;

            const stepName = target.replace(/^#(step|tab)-/, '');
            if (document.getElementById('tab-' + stepName)) {
                openTab(stepName);
                return;
            }

            const item = document.getElementById('step-' + stepName);
            if (item && item.classList.contains('accordion-item')) {
                openAccordion(stepName);
            }
        });
    }

    // Payment Method Panels
    // Mirrors the billing toggle above: hidden panels also get their inputs
    // disabled, so that a form filler cannot fill a method the shopper did
    // not choose.
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    const paymentPanels = document.querySelectorAll('.payment-method-panel');

    function applySelectedPaymentMethod() {
        const selected = document.querySelector('input[name="payment_method"]:checked');
        if (!selected) {
            paymentPanels.forEach(panel => {
                panel.style.display = 'none';
                panel.querySelectorAll('input, select, textarea').forEach(input => {
                    input.disabled = true;
                });
            });
            return;
        }

        paymentPanels.forEach(panel => {
            const active = panel.dataset.paymentMethod === selected.value;
            panel.style.display = active ? 'block' : 'none';
            panel.querySelectorAll('input, select, textarea').forEach(input => {
                input.disabled = !active;
            });
        });
    }

    if (paymentRadios.length > 0 && paymentPanels.length > 0) {
        applySelectedPaymentMethod();
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', applySelectedPaymentMethod);
        });
    }

    // Persist form data to SessionStorage for multi-page flows
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                sessionStorage.setItem(key, value);
            }
        });
    });

    // Validation navigation: when clicking Place Order (or submitting), if an
    // invalid form control is inside an inactive accordion item or tab, bring
    // the user to that section and display the validation error message.
    document.addEventListener('click', function(e) {
        const submitBtn = e.target.closest('button[type="submit"], input[type="submit"]');
        if (!submitBtn) return;
        const form = submitBtn.form || submitBtn.closest('form');
        if (!form) return;

        const invalidControl = findFirstInvalidControl(form);
        if (invalidControl) {
            const accordionItem = invalidControl.closest('.accordion-item');
            const tabContent = invalidControl.closest('.tab-content');
            if (accordionItem || tabContent) {
                e.preventDefault();
                navigateToInvalidControl(invalidControl);
            }
        }
    });

    let isHandlingInvalid = false;
    document.addEventListener('invalid', function(e) {
        if (isHandlingInvalid) return;
        const control = e.target;
        const accordionItem = control.closest('.accordion-item');
        const tabContent = control.closest('.tab-content');
        if (accordionItem || tabContent) {
            isHandlingInvalid = true;
            navigateToInvalidControl(control);
            setTimeout(function() {
                isHandlingInvalid = false;
            }, 100);
        }
    }, true);
});

function findFirstInvalidControl(form) {
    if (!form || !form.elements) return null;
    return Array.from(form.elements).find(function(el) {
        return !el.disabled && el.willValidate && typeof el.checkValidity === 'function' && !el.checkValidity();
    });
}

function openAccordion(stepName) {
    const cleanName = stepName.replace(/^step-/, '');
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(function(i) {
        i.classList.remove('active');
    });

    const item = document.getElementById('step-' + cleanName);
    if (item) {
        item.classList.add('active');
        if (item.scrollIntoView) {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

function navigateToInvalidControl(control) {
    if (!control) return;

    // Check if control is inside an accordion item
    const accordionItem = control.closest('.accordion-item');
    if (accordionItem) {
        const stepName = accordionItem.id.replace(/^step-/, '');
        openAccordion(stepName);
    }

    // Check if control is inside a tab content
    const tabContent = control.closest('.tab-content');
    if (tabContent) {
        const stepName = tabContent.id.replace(/^tab-/, '');
        openTab(stepName);
        if (tabContent.scrollIntoView) {
            tabContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    if (control.focus) {
        control.focus();
    }
    if (control.reportValidity) {
        control.reportValidity();
    }
}

function toggleAccordion(stepName) {
    const cleanName = stepName.replace(/^step-/, '');
    const item = document.getElementById('step-' + cleanName);
    if (!item) return;

    // Close all other items (Optional: remove this loop to allow multiple open)
    const allItems = document.querySelectorAll('.accordion-item');
    allItems.forEach(function(i) {
        if (i !== item) {
            i.classList.remove('active');
        }
    });

    // Toggle current item
    item.classList.toggle('active');
}

function nextAccordion(nextStepName) {
    openAccordion(nextStepName);
}

function openTab(stepName) {
    const cleanName = stepName.replace(/^tab-/, '');
    // Get all elements with class="tab-content" and hide them
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(function(content) {
        content.classList.remove("active");
    });

    // Get all elements with class="tab-button" and remove the class "active"
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Show the current tab, and add an "active" class to the button
    const targetTab = document.getElementById("tab-" + cleanName);
    if (targetTab) {
        targetTab.classList.add("active");
    }

    // Find the button that corresponds to this step to set active state.
    const selector = `.tab-button[onclick="openTab('${cleanName}')"]`;
    const buttons = document.querySelectorAll(selector);
    if (buttons.length > 0) {
        buttons[0].classList.add("active");
    }
}

function nextTab(nextStepName) {
    const cleanName = nextStepName.replace(/^tab-/, '');
    openTab(cleanName);
    const targetEl = document.getElementById("tab-" + cleanName);
    if (targetEl && targetEl.scrollIntoView) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
