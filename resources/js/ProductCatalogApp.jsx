import React, { startTransition, useEffect, useState } from 'react';
import {
    formatCurrency,
    formatDateTime,
    getProductErrorsCount,
    makeDraftFromProduct,
    normalizeProductPayload,
    validateImportFile,
    validateProductDraft,
} from './lib/productValidation';

const REQUIRED_COLUMNS = ['Nombre', 'Precio', 'Descripcion', 'Cantidad', 'URL de imagen del producto'];

const initialReport = {
    tone: 'neutral',
    message: '',
    fileErrors: [],
    rowErrors: [],
    summary: null,
};

export default function ProductCatalogApp() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const [report, setReport] = useState(initialReport);

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const payload = await requestJson('/api/products');

                if (!isMounted) {
                    return;
                }

                startTransition(() => {
                    setProducts(payload.products ?? []);
                });

                setLoadError('');
            } catch (error) {
                if (isMounted) {
                    setLoadError(error.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const metrics = computeMetrics(products);

    async function handleImport() {
        const fileError = validateImportFile(selectedFile);

        if (fileError) {
            setReport({
                tone: 'error',
                message: fileError,
                fileErrors: [fileError],
                rowErrors: [],
                summary: null,
            });

            return;
        }

        setIsImporting(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const payload = await requestJson('/api/products/import', {
                method: 'POST',
                body: formData,
            });

            startTransition(() => {
                setProducts(payload.products ?? []);
            });

            setReport({
                tone: 'success',
                message: payload.message ?? 'Archivo importado correctamente.',
                fileErrors: [],
                rowErrors: [],
                summary: payload.summary ?? null,
            });
        } catch (error) {
            setReport({
                tone: 'error',
                message: error.payload?.message ?? error.message,
                fileErrors: error.payload?.file_errors ?? [],
                rowErrors: error.payload?.errors ?? [],
                summary: error.payload?.summary ?? null,
            });
        } finally {
            setIsImporting(false);
        }
    }

    function handleProductSaved(updatedProduct) {
        startTransition(() => {
            setProducts((currentProducts) =>
                currentProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
            );
        });
    }

    return (
        <div className="app-shell">
            <div className="ambient-orb ambient-orb--warm" />
            <div className="ambient-orb ambient-orb--cool" />

            <header className="topbar">
                <div className="brand-lockup">
                    <div className="brand-mark">ML</div>
                    <div className="brand-copy">
                        <strong>Mercury Ledger</strong>
                        <span>Catalogo editable con Excel + Laravel + React</span>
                    </div>
                </div>

                <div className="status-pill">
                    Modo de trabajo: <strong>importacion validada + edicion inmediata</strong>
                </div>
            </header>

            <section className="hero-grid">
                <article className="panel panel--cut hero-copy">
                    <div>
                        <span className="eyebrow">Control editorial del catalogo</span>
                        <h1 className="hero-title">Carga Excel. Valida. Edita en vivo.</h1>
                        <p className="hero-lead">
                            La app procesa archivos de productos, bloquea caracteres prohibidos, muestra errores por fila y
                            convierte el catalogo en una pared de cards listas para edicion sin recargar la pagina.
                        </p>
                    </div>

                    <dl className="hero-detail-grid">
                        <div className="hero-detail">
                            <dt>Validacion dual</dt>
                            <dd>Frontend y backend revisan tipos, URLs, enteros, precios y caracteres no permitidos.</dd>
                        </div>
                        <div className="hero-detail">
                            <dt>Importacion segura</dt>
                            <dd>Cada carga reemplaza el catalogo actual solo si todo el Excel es consistente.</dd>
                        </div>
                        <div className="hero-detail">
                            <dt>Edicion inmediata</dt>
                            <dd>Los cambios se guardan y se reflejan al instante sobre el mismo estado visual.</dd>
                        </div>
                    </dl>
                </article>

                <aside className="panel panel--cut stats-rail">
                    <p className="rail-title">Radar del inventario</p>

                    <div className="stats-list">
                        <MetricCard
                            label="Productos cargados"
                            value={String(metrics.productCount)}
                            helper="Cantidad total de cards renderizadas en el catalogo."
                        />
                        <MetricCard
                            label="Unidades en stock"
                            value={String(metrics.totalStock)}
                            helper="Suma acumulada del inventario reportado por el Excel."
                        />
                        <MetricCard
                            label="Precio promedio"
                            value={formatCurrency(metrics.averagePrice)}
                            helper="Promedio simple para tomar pulso del ticket del catalogo."
                        />
                        <MetricCard
                            label="Ultima sincronizacion"
                            value={metrics.lastUpdatedLabel}
                            helper="Marca temporal del ultimo producto persistido en base de datos."
                        />
                    </div>
                </aside>
            </section>

            <section className="upload-grid">
                <article className="panel panel--cut upload-panel">
                    <div className="section-header">
                        <div>
                            <span className="section-kicker">Entrada principal</span>
                            <h2>Sube tu Excel</h2>
                            <p>
                                El archivo debe incluir las columnas minimas requeridas. Si existe un error, la app te dice
                                exactamente en que fila y campo ocurrio para que lo corrijas con rapidez.
                            </p>
                        </div>
                    </div>

                    <div className="dropzone">
                        <div>
                            <h3>Catalogo listo para revision</h3>
                            <p>
                                Acepta archivos <strong>.xlsx</strong> o <strong>.xls</strong>. La importacion solo se
                                confirma si todas las filas pasan la validacion.
                            </p>
                        </div>

                        <div className="dropzone-actions">
                            <input
                                id="catalog-file"
                                className="file-input"
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                            />

                            <label htmlFor="catalog-file" className="button-secondary">
                                Elegir archivo
                            </label>
                            <button className="button-primary" type="button" onClick={handleImport} disabled={isImporting}>
                                {isImporting ? 'Importando catalogo...' : 'Importar catalogo'}
                            </button>
                            <span className="file-name">{selectedFile?.name ?? 'Sin archivo seleccionado'}</span>
                        </div>
                    </div>

                    {report.message ? <ValidationReport report={report} /> : null}
                </article>

                <aside className="panel panel--cut rules-panel">
                    <div className="section-header">
                        <div>
                            <span className="section-kicker">Reglas minimas</span>
                            <h2>Control de calidad</h2>
                            <p>Las tarjetas solo nacen cuando cada producto llega con datos limpios y consistentes.</p>
                        </div>
                    </div>

                    <div className="rules-list">
                        <RuleItem
                            title="Columnas obligatorias"
                            description="Nombre, Precio, Descripcion, Cantidad y URL de imagen del producto."
                        />
                        <RuleItem
                            title="Tipos correctos"
                            description="Precio numerico, cantidad entera, textos validos y URL con formato correcto."
                        />
                        <RuleItem
                            title="Caracteres bloqueados"
                            description={'Se rechazan \' , " , ´ , ` y ¨ tanto al importar como al editar.'}
                        />
                        <RuleItem
                            title="Actualizacion inmediata"
                            description="Cada edicion exitosa persiste en backend y se refleja al instante en la UI."
                        />
                    </div>
                </aside>
            </section>

            <section className="content-grid">
                <div className="catalog-header">
                    <div>
                        <span className="section-kicker">Resultado del procesamiento</span>
                        <h2>Muro de productos</h2>
                        <p>
                            Cada pieza del catalogo se presenta como una ficha editable con vista previa de imagen, stock y
                            precio.
                        </p>
                    </div>

                    {loadError ? (
                        <div className="status-pill">
                            Error al cargar: <strong>{loadError}</strong>
                        </div>
                    ) : null}
                </div>

                {isLoading ? (
                    <div className="empty-state">
                        <h3>Cargando catalogo...</h3>
                        <p>Estoy consultando la base de datos para traer los productos existentes.</p>
                    </div>
                ) : products.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="catalog-grid">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                index={index}
                                product={product}
                                onProductSaved={handleProductSaved}
                            />
                        ))}
                    </div>
                )}
            </section>

            <p className="footer-note">
                Sugerencia: si vuelves a importar un Excel, el catalogo actual se reemplaza para evitar duplicados y mantener
                una sola fuente de verdad.
            </p>
        </div>
    );
}

function MetricCard({ helper, label, value }) {
    return (
        <article className="stat-card">
            <div className="stat-label">{label}</div>
            <div className="stat-value">{value}</div>
            <div className="stat-helper">{helper}</div>
        </article>
    );
}

function RuleItem({ description, title }) {
    return (
        <article className="rule-item">
            <strong>{title}</strong>
            <span>{description}</span>
        </article>
    );
}

function ValidationReport({ report }) {
    const groupedRows = groupRowErrors(report.rowErrors);
    const panelClass =
        report.tone === 'success'
            ? 'report-panel report-panel--success'
            : report.tone === 'error'
              ? 'report-panel report-panel--error'
              : 'report-panel';

    return (
        <section className={panelClass}>
            <h3>{report.message}</h3>
            {report.summary ? (
                <div className="report-summary">
                    <span className="summary-pill">Filas procesadas: {report.summary.processed_rows}</span>
                    <span className="summary-pill">Filas validas: {report.summary.valid_rows}</span>
                    <span className="summary-pill">Filas invalidas: {report.summary.invalid_rows}</span>
                </div>
            ) : null}

            {report.fileErrors.length > 0 ? (
                <div className="issues-grid">
                    {report.fileErrors.map((issue) => (
                        <article className="issue-card" key={issue}>
                            <strong>Error de archivo</strong>
                            <span>{issue}</span>
                        </article>
                    ))}
                </div>
            ) : null}

            {groupedRows.length > 0 ? (
                <div className="issues-grid">
                    {groupedRows.slice(0, 8).map((group) => (
                        <article className="issue-card" key={group.row}>
                            <small>Fila {group.row}</small>
                            <strong>{group.messages.length} observacion(es) en la fila</strong>
                            <ul className="issue-bullets">
                                {group.messages.map((message) => (
                                    <li key={`${group.row}-${message}`}>{message}</li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            ) : null}
        </section>
    );
}

function ProductCard({ index, onProductSaved, product }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(() => makeDraftFromProduct(product));
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [imageBroken, setImageBroken] = useState(false);
    const errorCount = getProductErrorsCount(errors);
    const previewImage = isEditing ? draft.image_url : product.image_url;

    useEffect(() => {
        if (!isEditing) {
            setDraft(makeDraftFromProduct(product));
            setErrors({});
        }
    }, [
        isEditing,
        product.description,
        product.id,
        product.image_url,
        product.name,
        product.price,
        product.quantity,
        product.updated_at,
    ]);

    useEffect(() => {
        setImageBroken(false);
    }, [previewImage]);

    async function handleSave() {
        const nextErrors = validateProductDraft(draft);
        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            setSaveMessage('Corrige los campos marcados para guardar.');
            return;
        }

        setIsSaving(true);

        try {
            const payload = await requestJson(`/api/products/${product.id}`, {
                method: 'PUT',
                body: JSON.stringify(normalizeProductPayload(draft)),
            });

            onProductSaved(payload.product);
            setSaveMessage('Cambios guardados y sincronizados.');
            setIsEditing(false);
            setErrors({});
        } catch (error) {
            setErrors(flattenLaravelErrors(error.payload?.errors));
            setSaveMessage(error.payload?.message ?? 'No fue posible guardar los cambios.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <article
            className={`catalog-card ${isEditing ? 'is-editing' : ''} ${saveMessage && !errorCount ? 'is-saved' : ''}`}
            style={{ '--index': index }}
        >
            <div className="card-visual">
                {!previewImage || imageBroken ? (
                    <div className="image-fallback">Vista previa pendiente</div>
                ) : (
                    <img alt={draft.name || product.name} src={previewImage} onError={() => setImageBroken(true)} />
                )}
                <span className="price-badge">{formatCurrency(product.price)}</span>
            </div>

            <div className="card-content">
                <h3 className="card-title">{product.name}</h3>
                <p className="card-description">{product.description}</p>

                <div className="meta-row">
                    <span className="meta-pill">Stock: {product.quantity}</span>
                    <span className="meta-pill">ID #{product.id}</span>
                    <span className="meta-pill">Actualizado: {formatDateTime(product.updated_at)}</span>
                </div>

                <div className="card-toolbar">
                    <div className="save-state">
                        {saveMessage ? saveMessage : isEditing ? 'Edicion activa: los cambios se validan en cliente.' : 'Listo para editar.'}
                    </div>

                    <div className="toolbar-actions">
                        <button
                            className="button-ghost"
                            type="button"
                            onClick={() => {
                                setIsEditing((current) => !current);
                                setSaveMessage('');
                                setErrors({});
                            }}
                        >
                            {isEditing ? 'Cerrar edicion' : 'Editar producto'}
                        </button>
                        <button className="button-primary" type="button" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <div className="field-grid">
                        <label className="field">
                            <span>Nombre</span>
                            <input
                                value={draft.name}
                                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                            />
                            {errors.name ? <div className="field-error">{errors.name}</div> : null}
                        </label>

                        <label className="field">
                            <span>Precio</span>
                            <input
                                inputMode="decimal"
                                value={draft.price}
                                onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))}
                            />
                            {errors.price ? <div className="field-error">{errors.price}</div> : null}
                        </label>

                        <label className="field field--full">
                            <span>Descripcion</span>
                            <textarea
                                value={draft.description}
                                onChange={(event) =>
                                    setDraft((current) => ({ ...current, description: event.target.value }))
                                }
                            />
                            {errors.description ? <div className="field-error">{errors.description}</div> : null}
                        </label>

                        <label className="field">
                            <span>Cantidad</span>
                            <input
                                inputMode="numeric"
                                value={draft.quantity}
                                onChange={(event) => setDraft((current) => ({ ...current, quantity: event.target.value }))}
                            />
                            {errors.quantity ? <div className="field-error">{errors.quantity}</div> : null}
                        </label>

                        <label className="field">
                            <span>URL de imagen</span>
                            <input
                                value={draft.image_url}
                                onChange={(event) =>
                                    setDraft((current) => ({ ...current, image_url: event.target.value }))
                                }
                            />
                            {errors.image_url ? <div className="field-error">{errors.image_url}</div> : null}
                        </label>
                    </div>
                ) : null}
            </div>
        </article>
    );
}

function EmptyState() {
    return (
        <div className="empty-state">
            <h3>El catalogo todavia esta vacio</h3>
            <p>
                Carga un Excel para poblar la aplicacion. En cuanto el archivo pase la validacion, las tarjetas apareceran
                aqui listas para edicion.
            </p>

            <div className="column-tags">
                {REQUIRED_COLUMNS.map((column) => (
                    <span key={column}>{column}</span>
                ))}
            </div>
        </div>
    );
}

function computeMetrics(products) {
    if (products.length === 0) {
        return {
            productCount: 0,
            totalStock: 0,
            averagePrice: 0,
            lastUpdatedLabel: 'Sin registros',
        };
    }

    const totalStock = products.reduce((sum, product) => sum + Number(product.quantity || 0), 0);
    const totalPrice = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
    const latestProduct = products.reduce((latest, product) => {
        if (!latest) {
            return product;
        }

        return new Date(product.updated_at) > new Date(latest.updated_at) ? product : latest;
    }, null);

    return {
        productCount: products.length,
        totalStock,
        averagePrice: totalPrice / products.length,
        lastUpdatedLabel: formatDateTime(latestProduct?.updated_at),
    };
}

function groupRowErrors(errors) {
    const rows = new Map();

    errors.forEach((item) => {
        const current = rows.get(item.row) ?? [];
        rows.set(item.row, [...current, ...(item.messages ?? [])]);
    });

    return Array.from(rows.entries()).map(([row, messages]) => ({
        row,
        messages,
    }));
}

function flattenLaravelErrors(errors) {
    if (!errors || typeof errors !== 'object') {
        return {};
    }

    return Object.entries(errors).reduce((accumulator, [field, messages]) => {
        accumulator[field] = Array.isArray(messages) ? messages[0] : String(messages);
        return accumulator;
    }, {});
}

async function requestJson(url, options = {}) {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(isFormData || !options.body ? {} : { 'Content-Type': 'application/json' }),
            ...(options.headers ?? {}),
        },
    });

    const responseText = await response.text();
    let payload = {};

    if (responseText) {
        try {
            payload = JSON.parse(responseText);
        } catch {
            payload = { message: responseText };
        }
    }

    if (!response.ok) {
        const error = new Error(payload.message ?? 'Ocurrio un error al procesar la solicitud.');
        error.payload = payload;
        throw error;
    }

    return payload;
}