import validator from 'validator';
import React, { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-dropdown-select';
import { findFromList } from '../Utils/helper';



export const handleOnChange = (event, setValue) => {
    const inputValue = event.target.value;
    const inputSelectionStart = event.target.selectionStart;
    const inputSelectionEnd = event.target.selectionEnd;

    const upperCaseValue = inputValue.toUpperCase();

    const valueBeforeCursor = upperCaseValue.slice(0, inputSelectionStart);
    const valueAfterCursor = upperCaseValue.slice(inputSelectionEnd);

    setValue(valueBeforeCursor + inputValue.slice(inputSelectionStart, inputSelectionEnd) + valueAfterCursor);

    // Set the cursor position to the end of the input value
    setTimeout(() => {
        event.target.setSelectionRange(valueBeforeCursor.length + inputValue.slice(inputSelectionStart, inputSelectionEnd).length, valueBeforeCursor.length + inputValue.slice(inputSelectionStart, inputSelectionEnd).length);
    });
};

export const MultiSelectDropdown = ({ name, selected, labelName, setSelected, options, readOnly = false, tabIndex = null, className = "", inputClass }) => {
    return (
        <div className={`m-1 grid grid-cols-1 md:grid-cols-3 items-center z-0 md:my-0.5 md:py-3 data ${className}`}>
            <label className={`md:text-start flex ${labelName}`} >{name}</label>
            <MultiSelect
                className={`focus:outline-none  border border-gray-500 rounded text-black  ${inputClass}`}
                options={options}
                value={selected}
                onChange={readOnly ? () => { } : setSelected}
                labelledBy="Select"
            />
        </div>
    );
};

export const TextInput = ({ name, type, value, setValue, readOnly, className, required = false, disabled = false, tabIndex = null, onBlur = null }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 items-center md:my-0.5 md:px-1 data gap-1'>
            <label className={`md:text-start flex ${className}`}>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <input onBlur={onBlur} tabIndex={tabIndex ? tabIndex : undefined} type={type} disabled={disabled} required={required} className='input-field focus:outline-none md:col-span-2 border-emerald-800 border-2 rounded' value={value} onChange={(e) => { type === "number" ? setValue(e.target.value) : handleOnChange(e, setValue) }} readOnly={readOnly} />
        </div>
    )
}

export const LongTextInput = ({ name, type, value, setValue, className, readOnly, required = false, disabled = false, tabIndex = null }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 items-center md:my-0.5 md:px-1 data gap-1'>
            <label className='md:text-start flex'>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <input tabIndex={tabIndex ? tabIndex : undefined} type={type} disabled={disabled} required={required} className={className} value={value} onChange={(e) => { type === "number" ? setValue(e.target.value) : handleOnChange(e, setValue) }} readOnly={readOnly} />
        </div>
    )
}

export const DisabledInput = ({ name, type, value, className = "", textClassName = "", tabIndex = null }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 items-center md:my-0.5 md:px-1 data  ${className}`}>
            <label className={`md:text-start flex ${className} `}>{name}</label>
            <input tabIndex={tabIndex ? tabIndex : undefined} type={type} className={`input-field ${textClassName} focus:outline-none md:col-span-2 border-2 border-emerald-800 p-1 rounded`} value={value} disabled />
        </div>
    )
}

export const LongDisabledInput = ({ name, type, value, className, tabIndex = null }) => {
    return (
        <div className={`grid grid-flow-col  items-center md:my-0.5 md:px-1 data ${className}`}>
            <label className={`md:text-start flex ${className} `}>{name}</label>
            <input type={type} className={`h-6 border border-gray-500 rounded`} value={value} disabled />
        </div>
    )
}

export const TextArea = ({ name, value, setValue, readOnly, required = false, disabled = false, rows = 2, cols = 30, tabIndex = null }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 md:my-1 md:px-1 data'>
            <label className='md:text-start flex'>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <textarea tabIndex={tabIndex ? tabIndex : undefined} name={name} disabled={disabled} required={required} className='focus:outline-none md:col-span-2 border border-gray-500 rounded' cols={cols} rows={rows} value={value} onChange={(e) => { handleOnChange(e, setValue); }} readOnly={readOnly}></textarea>
        </div>
    )
}

export const DropdownInput = ({ name, beforeChange = () => { }, onBlur = null, options, value, setValue, defaultValue, className, readOnly, required = false, disabled = false, clear = false, tabIndex = null, autoFocus = false }) => {
    const handleOnChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <div className='grid grid-cols-3 items-center md:my-1 md:px-1 data'>
            <label className={`md:text-start flex ${className}`}>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <select
                onBlur={onBlur}
                autoFocus={autoFocus} tabIndex={tabIndex ? tabIndex : undefined} defaultValue={defaultValue} id='dd'
                required={required} name="name" className='input-field border-2 border-emerald-800 md:col-span-2 col-span-1 rounded'
                value={value} onChange={(e) => { beforeChange(); handleOnChange(e); }} disabled={readOnly}>
                <option value="" hidden={!clear}>Select</option>
                {options.map((option, index) => <option key={index} value={option.value} >
                    {option.show}
                </option>)}
            </select>
        </div>
    )
}

export const LongDropdownInput = ({ name, options, value, setValue, defaultValue, className, readOnly, required = false,
    disabled = false, clear = false, tabIndex = null }) => {
    const handleOnChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <div className='grid grid-cols-12 items-center md:my-1 md:px-1 data'>
            <label className={`text-start col-span-2 `}>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <select tabIndex={tabIndex ? tabIndex : undefined} defaultValue={defaultValue} id='dd' required={required} name="name"
                className={`border-2 border-emerald-800 h-6 rounded ${className} col-span-10`} value={value} onChange={(e) => { handleOnChange(e); }} disabled={readOnly}>
                <option value="">Select</option>
                {options.map((option, index) => <option key={index} value={option.value} >
                    {option.show}
                </option>)}
            </select>
        </div>
    )
}

export const RadioButton = ({ label, value, onChange, readOnly, className, tabIndex = null }) => {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <input type="radio" tabIndex={tabIndex ? tabIndex : undefined} checked={value} onChange={onChange} />
            <label>
                {label}
            </label>
        </div>
    );
};


export const DropdownInputWithoutLabel = ({ options, value, setValue, readOnly, required = false, disabled = false, tabIndex = null }) => {
    const handleOnChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 items-center md:my-1 md:px-1 data'>
            <select tabIndex={tabIndex ? tabIndex : undefined} required={required} name="name" className='input-field md:col-span-2 border col-span-1 rounded' value={value} onChange={(e) => { handleOnChange(e); }} disabled={readOnly}>
                <option value="" hidden>Select</option>
                {options.map((option, index) => <option key={index} value={option.value} >{option.show}</option>)}
            </select>
        </div>
    )
}


export const CurrencyInput = ({ name, value, setValue, readOnly, required = false, disabled = false, tabIndex = null }) => {
    const handleOnChange = (e) => {
        setValue(e.target.value);
    }
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 items-center md:my-1 md:px-1 data'>
            <label htmlFor="id" className='md:text-start flex'>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <input tabIndex={tabIndex ? tabIndex : undefined} type="number" disabled={disabled} required={required} className='input-field focus:outline-none md:col-span-2 border rounded' min="1" step="any" id='id' value={value} onChange={(e) => { handleOnChange(e); }} readOnly={readOnly} />
        </div>
    )
}

const RequiredLabel = ({ name }) => <p>{`${name}`}<span className="text-red-500">*</span> </p>



export const DateInput = ({ name, value, setValue, readOnly, required = false, type = "date", disabled = false, tabIndex = null, inputClass, inputHead }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 items-center md:my-1 md:px-1 data w-full'>
            <label htmlFor="id" className={`md:text-start flex ${inputHead}`}>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <input tabIndex={tabIndex ? tabIndex : undefined} type={type} disabled={disabled} required={required}
                className={`input-field focus:outline-none md:col-span-2 border border-gray-500 rounded w-full ${inputClass}`} id='id' value={value} onChange={(e) => { setValue(e.target.value); }} readOnly={readOnly} />
        </div>
    )
}

export const LongDateInput = ({ name, value, setValue, readOnly, className, required = false, type = "date", disabled = false, tabIndex = null }) => {

    return (
        <div className='grid grid-flow-col item-center justify-center gap-12 w-56 items-center md:px-1 data'>
            <label htmlFor="id" className='md:text-start flex'>{required ? <RequiredLabel name={name} /> : `${name}`}</label>
            <input tabIndex={tabIndex ? tabIndex : undefined} type={type} disabled={disabled} required={required} className={`${className} focus:outline-none border border-gray-500 form-border-color rounded h-6`} id='id' value={value} onChange={(e) => { setValue(e.target.value); }} readOnly={readOnly} />
        </div>
    )
}

export const CheckBox = ({ name, value, setValue, readOnly = false, className, required = false, disabled = false, tabIndex = null }) => {
    const handleOnChange = (e) => {
        setValue(!value);
    }
    return (
        <div className='items-center md:my-1 md:px-1 data'>
            <label htmlFor="id" className={`md:text-start items-center ${className}`}>
                <input tabIndex={tabIndex ? tabIndex : undefined} type="checkbox" required={required} className='mx-2 py-2' checked={value} onChange={(e) => { handleOnChange(e); }} disabled={readOnly} />
                {name}
            </label>
        </div>
    )
}



export const validateEmail = (data) => {
    return validator.isEmail(data);
}

export const validateMobile = (data) => {
    let regMobile = /^[6-9]\d{9}$/;
    return regMobile.test(data);
}

export const validatePan = (data) => {
    let regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    return regpan.test(data);
}

export const validatePincode = (data) => {
    return data.toString().length === 6;
}

export const DropdownWithSearch = ({ options, value, setValue, readOnly }) => {
    const [currentIndex, setCurrentIndex] = useState("");
    useEffect(() => setCurrentIndex(new Date()), [])
    useEffect(() => {
        const dropDownElement = document.getElementById(`dropdown${currentIndex}`);
        dropDownElement.addEventListener('keydown', function (ev) {
            var focusableElementsString = '[tabindex="0"]';
            let ol = dropDownElement.querySelectorAll(focusableElementsString);
            if (ev.key === "ArrowDown") {
                for (let i = 0; i < ol.length; i++) {
                    if (ol[i] === ev.target) {
                        let o = i < ol.length - 1 ? ol[i + 1] : ol[0];
                        o.focus(); break;
                    }
                }
                ev.preventDefault()
            } else if (ev.key === "ArrowUp") {
                for (let i = 0; i < ol.length; i++) {
                    if (ol[i] === ev.target) {
                        let o = ol[i - 1];
                        o.focus(); break;
                    }
                }
                ev.preventDefault()
            }
        });

        return () => {
            dropDownElement.removeEventListener('keydown', () => { });
        };
    }, [currentIndex]);

    // const ItemRenderer = ({ item, itemIndex, props, state, methods }) =>
    //     <div onClick={() => methods.addItem(item)} tabIndex={0} className='hover:bg-blue-500'>{item.name}</div>

    // const ContentRenderer = ({ state }) =>
    //     <div tabIndex={0} className='hover:bg-blue-500'>{`${state?.values[0]}1`}</div>


    return (
        <div id={`dropdown${currentIndex}`}>
            <Select className='' searchBy='name' options={options || []}
                key={value}
                // ContentRenderer={ContentRenderer}
                // itemRenderer={ItemRenderer}
                disabled={readOnly}
                labelField="name"
                valueField="id"
                multi={false}
                values={value ? [{
                    id: value, name:
                        findFromList(value, options || [], "name")
                }] : []}
                onChange={(value) => {
                    setValue(value[0] ? value[0]?.id : "")
                }} />
        </div>
    )
}


