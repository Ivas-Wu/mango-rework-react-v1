import React from 'react'
import { Operator } from '../Tiles/TileModels';
import ActionBarButton from './ActionBarButton';

interface OperatorsProps {
    operator: Operator;
    selected: boolean;
    onClick: (operator: Operator) => void;
}
const Operators: React.FC<OperatorsProps> = ({ operator, selected, onClick }) => {
    const getTileStyle = () => {
        return selected ? 'border-yellow-200 text-yellow-200 font-bold font-2xl' : '';
    };

    return (
        <ActionBarButton
            value={operator}
            customStyle={getTileStyle()}
            onClick={() => onClick(operator)}
        />
    )
}

export default Operators
