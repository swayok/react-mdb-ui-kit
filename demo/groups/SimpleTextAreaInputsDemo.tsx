export function SimpleTextAreaInputsDemo() {

    return (
        <>
            <div>
                <label className="form-label">Input normal</label>
                <textarea
                    className="form-control mb-4"
                    placeholder="Placeholder"
                />
            </div>
            <div>
                <label className="form-label">Input readonly</label>
                <textarea
                    className="form-control mb-4"
                    readOnly
                    defaultValue="Read only"
                />
            </div>
            <div>
                <label className="form-label">Input disabled</label>
                <textarea
                    className="form-control mb-4"
                    disabled
                    defaultValue="Disabled"
                />
            </div>

            <div>
                <label className="form-label">Input small</label>
                <textarea
                    className="form-control form-control-sm mb-4"
                    placeholder="Placeholder"
                />
            </div>
            <div>
                <label className="form-label">Input large</label>
                <textarea
                    className="form-control form-control-lg mb-4"
                    placeholder="Placeholder"
                />
            </div>
            <div className="mb-4">
                <label className="form-label">Input normal invalid</label>
                <textarea
                    className="form-control is-invalid"
                    defaultValue="value"
                />
            </div>
            <div className="mb-4">
                <label className="form-label">Input normal invalid with message</label>
                <textarea
                    className="form-control is-invalid"
                    defaultValue="value"
                />
                <div className="invalid-feedback">
                    Validation error
                </div>
            </div>
        </>
    )
}
