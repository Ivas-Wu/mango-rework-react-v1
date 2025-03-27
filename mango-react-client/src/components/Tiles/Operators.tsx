import React from 'react'
import { Operator } from './TileModels';

interface OperatorsProps {
    operator: Operator;
    selected: boolean;
    onClick: (operator: Operator) => void;
}
const Operators: React.FC<OperatorsProps> = ({ operator, selected, onClick }) => {
    const getTileStyle = () => {
        let style = '';
        if (selected) {
            style += 'border-yellow-200 text-yellow-200 font-bold font-2xl';
        }
        else {
            style += 'border-slate-800';
        }
        return style;
    };

    return (
        <button onClick={() => onClick(operator)} className={`flex-grow border-solid border-2 rounded-md bg-slate-200 ${getTileStyle()}`}>{operator}</button>
    )
}

export default Operators
