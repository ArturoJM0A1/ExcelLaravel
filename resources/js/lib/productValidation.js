const forbiddenPattern = /['"´`¨]/u;
const forbiddenCharactersLabel = `' " ´ \` ¨`;

export function makeDraftFromProduct(product) {
    return {
        name: product?.name ?? '',
        price: product?.price !== undefined && product?.price !== null ? String(product.price) : '',
        description: product?.description ?? '',
        quantity: product?.quantity !== undefined && product?.quantity !== null ? String(product.quantity) : '',
        image_url: product?.image_url ?? '',
    };
}

export function validateImportFile(file) {
    if (!file) {
        return 'Selecciona un archivo Excel antes de importar.';
    }

    if (!/\.xlsx?$/.test(file.name.toLowerCase())) {
        return 'El archivo debe tener extension .xlsx o .xls.';
    }

    return '';
}

export function validateProductDraft(draft) {
    const errors = {};
    const name = draft.name.trim();
    const description = draft.description.trim();
    const imageUrl = draft.image_url.trim();
    const price = Number(draft.price);
    const quantity = Number(draft.quantity);

    if (!name) {
        errors.name = 'Ingresa un nombre para el producto.';
    } else if (forbiddenPattern.test(name)) {
        errors.name = `El nombre no puede contener ${forbiddenCharactersLabel}.`;
    }

    if (!description) {
        errors.description = 'Agrega una descripcion.';
    } else if (forbiddenPattern.test(description)) {
        errors.description = `La descripcion no puede contener ${forbiddenCharactersLabel}.`;
    }

    if (draft.price === '' || Number.isNaN(price)) {
        errors.price = 'El precio debe ser numerico.';
    } else if (price < 0) {
        errors.price = 'El precio no puede ser negativo.';
    }

    if (draft.quantity === '' || Number.isNaN(quantity)) {
        errors.quantity = 'La cantidad debe ser un numero entero.';
    } else if (!Number.isInteger(quantity)) {
        errors.quantity = 'La cantidad debe ser un numero entero.';
    } else if (quantity < 0) {
        errors.quantity = 'La cantidad no puede ser negativa.';
    }

    if (!imageUrl) {
        errors.image_url = 'Agrega la URL de la imagen.';
    } else if (forbiddenPattern.test(imageUrl)) {
        errors.image_url = `La URL no puede contener ${forbiddenCharactersLabel}.`;
    } else {
        try {
            new URL(imageUrl);
        } catch {
            errors.image_url = 'Usa una URL valida para la imagen.';
        }
    }

    return errors;
}

export function normalizeProductPayload(draft) {
    return {
        name: draft.name.trim(),
        price: Number(draft.price),
        description: draft.description.trim(),
        quantity: Number.parseInt(draft.quantity, 10),
        image_url: draft.image_url.trim(),
    };
}

export function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);
}

export function formatDateTime(value) {
    if (!value) {
        return 'Sin sincronizacion';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return 'Sin sincronizacion';
    }

    return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

export function getProductErrorsCount(errors) {
    return Object.keys(errors).length;
}
