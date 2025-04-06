import React from 'react'
interface ActionBarButtonProps {
    value: string;
    customStyle?: string;
    disabled?: boolean;
    onClick: () => void;
}

const ActionBarButton: React.FC<ActionBarButtonProps> = ({ value, customStyle, disabled, onClick}) => {
    const getTileStyle = (): string => {
        return disabled ? 'border-slate-600 text-slate-600 font-small font-xl bg-slate-400' : customStyle && customStyle?.length > 0 ? customStyle : 'border-slate-800';
    };

    const getHoverStyle = (): string => {
        return disabled ? '' : 'hover:bg-white';
    }

    return (
        <button disabled={disabled ?? false} onClick={() => onClick()} className={`flex-grow border-solid border-2 rounded-md bg-slate-200 ${getTileStyle()} ${getHoverStyle()}`}>{value}</button>
    )
}

export default ActionBarButton
